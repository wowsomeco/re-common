import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { FiDownload, FiEye } from 'react-icons/fi';

import { Btn } from '~w-common/components/btn';
import FilePreview from '~w-common/components/file-preview/filePreview';
import { FileModel } from '~w-common/hooks/useFileUpload';
import { TW_CENTER } from '~w-common/scripts';
import { capitalize, formatBytes, saveAs } from '~w-common/scripts/extensions';

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle: React.CSSProperties = {
  borderColor: '#2196f3'
};

const acceptStyle: React.CSSProperties = {
  borderColor: '#00e676'
};

const rejectStyle: React.CSSProperties = {
  borderColor: '#ff1744'
};

export interface LocalFormFileProps extends Omit<ViewFormFileProps, 'file'> {
  accept?: string | string[];
  defaultValue?: FileModel;
  disabled?: boolean;
  uploading?: boolean;
  dropText?: string;
  maxSize?: number;
  maxFiles?: number;
  /** custom header to replace viewer */
  header?: React.ReactNode;
  onUpload?: (f: File) => Promise<void>;
  onChange?: (f: File) => void;
  renderLoader?: () => React.ReactNode;
  noteMsg?: string;
  acceptMsg?: string;
  acceptReplaceAll?: string;
  maxFileReplaceAll?: string;
}

export interface RenderDownloaderOpts {
  downloading: boolean;
  download: () => void | Promise<void>;
}

export type RenderDownloader = (opts: RenderDownloaderOpts) => React.ReactNode;

export const Downloader: React.FC<{
  file: FileModel;
  renderDownloader?: RenderDownloader;
}> = ({ file, renderDownloader }) => {
  const [downloading, setDownloading] = React.useState(false);

  const download = async () => {
    if (downloading) return;

    setDownloading(true);
    await saveAs(file);
    setDownloading(false);
  };

  if (renderDownloader) {
    return <>{renderDownloader({ downloading, download })}</>;
  }

  return downloading ? (
    <CircularProgress />
  ) : (
    <Tooltip title='Download' arrow>
      <IconButton onClick={download}>
        <FiDownload className='cursor-pointer text-green-500' />
      </IconButton>
    </Tooltip>
  );
};

export interface RenderPreviewerOpts {
  preview: () => void | Promise<void>;
}

export type RenderPreviewer = (opts: RenderPreviewerOpts) => React.ReactNode;

export const Previewer: React.FC<{
  file: FileModel;
  renderPreviewer?: RenderPreviewer;
}> = ({ file, renderPreviewer }) => {
  const [openPreview, setOpenPreview] = React.useState(false);

  const doOpenPreview = React.useCallback(() => {
    setOpenPreview(true);
  }, []);

  return (
    <>
      {renderPreviewer ? (
        renderPreviewer({ preview: doOpenPreview })
      ) : (
        <Tooltip title='Show File' arrow>
          <IconButton onClick={doOpenPreview}>
            <FiEye className='cursor-pointer text-blue-500' />
          </IconButton>
        </Tooltip>
      )}
      <FilePreview
        file={file}
        open={openPreview}
        setOpen={(f) => setOpenPreview(f)}
      />
    </>
  );
};

export interface ViewFormFileProps {
  label: string;
  file?: FileModel;
  notFound?: React.ReactNode;
  renderDownloader?: RenderDownloader;
  renderPreviewer?: RenderPreviewer;
  renderDelete?: () => React.ReactNode;
}

export const ViewFormFile: React.FC<ViewFormFileProps> = ({
  label,
  file,
  notFound = null,
  renderDownloader,
  renderPreviewer,
  /** TODO: give default value to renderDelete */
  renderDelete = () => null
}) => {
  return (
    <div
      style={{ minHeight: '50px' }}
      className='flex flex-wrap items-center justify-between mb-2 gap-3'
    >
      <p className='text-gray-500'>{label}</p>
      {file ? (
        <div className='flex space-x-3'>
          <Downloader file={file} renderDownloader={renderDownloader} />
          <Previewer file={file} renderPreviewer={renderPreviewer} />
          {renderDelete()}
        </div>
      ) : (
        notFound
      )}
    </div>
  );
};

const LocalFormFile: React.FC<LocalFormFileProps> = ({
  label,
  notFound,
  accept,
  defaultValue,
  disabled = false,
  uploading = false,
  dropText = 'Drag and drop the file here, or click to upload',
  maxSize = 31457280, // 30 mb
  maxFiles = 1,
  onUpload,
  onChange,
  renderLoader,
  renderDownloader,
  renderPreviewer,
  renderDelete,
  header,
  noteMsg,
  acceptMsg,
  acceptReplaceAll = '$accept',
  maxFileReplaceAll = '$maxFile'
}) => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept,
    maxFiles,
    disabled: uploading || disabled,
    maxSize: maxSize
  });

  const acceptedFileItems = acceptedFiles.map((file: FileWithPath) => (
    <p key={file.path}>
      {file.path} - {formatBytes(file.size)}
    </p>
  ));

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const doUpload = async () => {
    if (onUpload) await onUpload(acceptedFiles[0]);
  };

  // Add note and replace "accept" and "maxFile" into max file upload
  const convertBytes = formatBytes(maxSize);
  noteMsg = accept
    ? noteMsg?.replaceAll(
        acceptReplaceAll,
        acceptMsg || `${accept}`.replaceAll(',', '/ ')
      )
    : noteMsg;
  noteMsg = noteMsg?.replaceAll(maxFileReplaceAll, convertBytes);

  // On Mount
  React.useEffect(() => {
    if (onChange && acceptedFiles[0]) onChange(acceptedFiles[0]);
  }, [acceptedFiles]);

  // show the FileError.code for now
  // TODO: handle each of the code accordingly for better clarity of what went wrong
  const uploadErr = !fileRejections?.length
    ? undefined
    : capitalize(fileRejections?.[0].errors?.[0].code, '-');
  const canUpload = !disabled && acceptedFiles.length > 0 && !uploadErr;

  return (
    <div className='w-full'>
      {header ? (
        header
      ) : (
        <ViewFormFile
          label={label}
          file={defaultValue}
          notFound={notFound}
          renderDownloader={renderDownloader}
          renderPreviewer={renderPreviewer}
          renderDelete={renderDelete}
        />
      )}
      <div {...getRootProps({ style })}>
        {uploading ? (
          <div className={TW_CENTER}>
            {renderLoader ? (
              renderLoader()
            ) : (
              <p className='cursor-pointer hover:text-blue-500'>Uploading...</p>
            )}
          </div>
        ) : (
          <>
            {disabled ? (
              <div>Upload disabled</div>
            ) : (
              <>
                <input {...getInputProps()} />
                <div className='text-yellow-500 text-center text-sm'>
                  {noteMsg}
                </div>
                <p className='cursor-pointer hover:text-blue-500'>{dropText}</p>
              </>
            )}
          </>
        )}
      </div>
      <div className='flex items-center justify-between mt-2'>
        {!canUpload ? (
          <p className='text-red-400'>{uploadErr}</p>
        ) : (
          acceptedFileItems
        )}
        {canUpload && !onChange ? (
          <Btn
            type='button'
            onClick={doUpload}
            loading={uploading}
            variant='outlined'
          >
            Upload
          </Btn>
        ) : null}
      </div>
    </div>
  );
};

export default LocalFormFile;
