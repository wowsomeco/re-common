import { FileModel } from '~app/models';
import { useAppProvider } from '~w-common/contexts/appContext';
import { useNotifProvider } from '~w-common/contexts/notifContext';
import { subDomain } from '~w-common/scripts';

import { useSafeState } from './useSafeState';

export interface FileUploadState {
  progress: number;
  uploading: boolean;
  done: boolean;
  upload: (file: File) => Promise<FileModel>;
}

export const useFileUpload = (endpoint: string): FileUploadState => {
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
        resolve(JSON.parse(xhr.responseText));

        notif.next({ msg: 'File Successfully Uploaded', state: 'info' });
      };
      xhr.onerror = reject;
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const percentComplete = (ev.loaded / ev.total) * 100;
          setProgress(percentComplete);
        }
      };

      xhr.open('POST', apiUrl(endpoint));
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
