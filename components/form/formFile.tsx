import Box from '@material-ui/core/Box';
import CircularProgress, {
  CircularProgressProps
} from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import LocalFormFile, {
  LocalFormFileProps
} from '~w-common/components/form/localFormFile';
import {
  FileModel,
  UploadMethod,
  useFileUpload
} from '~w-common/hooks/useFileUpload';

export interface FormFileProps extends LocalFormFileProps {
  endpoint: string;
  method?: UploadMethod;
  onUploaded?: (f: FileModel) => void;
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

const FormFile: React.FC<FormFileProps> = ({
  endpoint,
  method = 'POST',
  onUploaded,
  label,
  accept,
  defaultValue,
  renderLoader,
  onUpload,
  uploading: uploadingProp,
  ...props
}) => {
  const {
    progress,
    uploading = uploadingProp,
    upload
  } = useFileUpload(endpoint, method);
  const doUpload = async (file: File) => {
    const f = await upload(file);
    onUploaded?.(f);
  };

  return (
    <LocalFormFile
      label={label}
      accept={accept}
      defaultValue={defaultValue}
      onUpload={onUpload ? onUpload : doUpload}
      uploading={uploading}
      renderLoader={
        renderLoader
          ? renderLoader
          : () => <CircularProgressWithLabel value={progress} />
      }
      {...props}
    />
  );
};

export default FormFile;
