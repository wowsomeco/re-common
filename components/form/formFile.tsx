import Box from '@material-ui/core/Box';
import CircularProgress, {
  CircularProgressProps
} from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { FiDownload, FiEye } from 'react-icons/fi';

import { Btn } from '~w-common/components/btn';
import { FileModel, useFileUpload } from '~w-common/hooks/useFileUpload';
import { TW_CENTER } from '~w-common/scripts';
import { capitalize, formatBytes, saveAs } from '~w-common/scripts/extensions';

import FilePreview from '../file-preview/filePreview';

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

interface FormFileProps {
  label: string;
  endpoint: string;
  accept?: string | string[];
  defaultValue: FileModel | undefined;
  onUploaded: (f: FileModel) => void;
}

const CircularProgressWithLabel: React.FC<
  CircularProgressProps & { value: number }
> = (props) => {
  return (
    <Box position='relative' display='inline-flex'>
      <CircularProgress variant='determinate' {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography
          variant='caption'
          component='div'
          color='textSecondary'
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const Downloader: React.FC<{ file: FileModel }> = ({ file }) => {
  const [downloading, setDownloading] = React.useState(false);

  const download = async () => {
    if (downloading) return;

    setDownloading(true);
    await saveAs(file);
    setDownloading(false);
  };

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

const Previewer: React.FC<{ file: FileModel }> = ({ file }) => {
  const [openPreview, setOpenPreview] = React.useState(false);

  return (
    <>
      <Tooltip title='Show File' arrow>
        <IconButton onClick={() => setOpenPreview(true)}>
          <FiEye className='cursor-pointer text-blue-500' />
        </IconButton>
      </Tooltip>
      <FilePreview
        file={file}
        open={openPreview}
        setOpen={(f) => setOpenPreview(f)}
      />
    </>
  );
};

const FormFile: React.FC<FormFileProps> = ({
  label,
  endpoint,
  accept,
  defaultValue,
  onUploaded
}) => {
  const { progress, uploading, upload } = useFileUpload(endpoint);

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
    maxFiles: 1,
    disabled: uploading,
    maxSize: 31457280 // 30 mb
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
    const f = await upload(acceptedFiles[0]);
    onUploaded(f);
  };

  // show the FileError.code for now
  // TODO: handle each of the code accordingly for better clarity of what went wrong
  const uploadErr = !fileRejections?.length
    ? undefined
    : capitalize(fileRejections?.[0].errors?.[0].code, '-');
  const canUpload = acceptedFiles.length > 0 && !uploadErr;

  return (
    <div className='w-full'>
      <div
        style={{ minHeight: '50px' }}
        className='flex items-center justify-between mb-2'
      >
        <p className='text-gray-500'>{label}</p>
        {defaultValue ? (
          <div className='flex'>
            <Downloader file={defaultValue} />
            <Previewer file={defaultValue} />
          </div>
        ) : null}
      </div>
      <div {...getRootProps({ style })}>
        {uploading ? (
          <div className={TW_CENTER}>
            <CircularProgressWithLabel value={progress} />
          </div>
        ) : (
          <>
            <input {...getInputProps()} />
            <p className='cursor-pointer hover:text-blue-500'>
              Drag and drop the file here, or click to upload
            </p>
          </>
        )}
      </div>
      <div className='flex items-center justify-between mt-2'>
        {!canUpload ? (
          <p className='text-red-400'>{uploadErr}</p>
        ) : (
          acceptedFileItems
        )}
        {canUpload ? (
          <Btn onClick={doUpload} loading={uploading} variant='outlined'>
            Upload
          </Btn>
        ) : null}
      </div>
    </div>
  );
};

export default FormFile;
