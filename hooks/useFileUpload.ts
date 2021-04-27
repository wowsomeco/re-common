import { useAppProvider } from '~w-common/contexts/appContext';
import { useNotifProvider } from '~w-common/contexts/notifContext';
import { subDomain } from '~w-common/scripts';

import { HttpMethod } from './useHttp';
import { useSafeState } from './useSafeState';

export type UploadMethod = Exclude<HttpMethod, 'GET' | 'DELETE'>;

export interface FileModel {
  key: string;
  url: string;
  name: string;
  type: string;
}

export interface FileUploadState {
  progress: number;
  uploading: boolean;
  done: boolean;
  upload: (file: File) => Promise<FileModel>;
}

export const useFileUpload = (
  endpoint: string,
  method: UploadMethod = 'POST'
): FileUploadState => {
  const { apiUrl, checkToken, tenantKey } = useAppProvider();
  const { notif } = useNotifProvider();

  const [progress, setProgress] = useSafeState(0);
  const done = progress === 100;
  const uploading = progress > 0 && !done;

  const upload = (file: File): Promise<FileModel> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        setProgress(100);
        // response will be either the FileModel or {error:string}
        const resp: Record<string, any> = JSON.parse(xhr.responseText);
        const err = xhr.status !== 200;
        // notify accordingly
        notif.next({
          msg: err ? resp?.error : 'File Successfully Uploaded',
          state: err ? 'error' : 'info'
        });
        // reject when error, otherwise resolve
        err ? reject(resp) : resolve(resp as FileModel);
      };
      xhr.onerror = reject;
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const percentComplete = (ev.loaded / ev.total) * 100;
          setProgress(percentComplete);
        }
      };

      xhr.open(method.toString(), apiUrl(endpoint));
      const token = checkToken();
      if (token) xhr.setRequestHeader('Authorization', token);
      if (tenantKey) xhr.setRequestHeader(tenantKey, subDomain());

      const formData = new FormData();
      formData.append('file', file, file.name);
      xhr.send(formData);
    });
  };

  return { progress, done, uploading, upload };
};
