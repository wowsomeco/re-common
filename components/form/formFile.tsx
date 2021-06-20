import Box from '@material-ui/core/Box';
import CircularProgress, {
  CircularProgressProps
} from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import LocalFormFile from '~w-common/components/form/localFormFile';
import {
  FileModel,
  UploadMethod,
  useFileUpload
} from '~w-common/hooks/useFileUpload';

interface FormFileProps {
  label: string;
  endpoint: string;
  accept?: string | string[];
  method?: UploadMethod;
  defaultValue: FileModel | undefined;
  onUploaded: (f: FileModel) => void;
}

const CircularProgressWithLabel: React.FC<
  CircularProgressProps & { value: number }
> = (props) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const FormFile: React.FC<FormFileProps> = ({
  label,
  endpoint,
  accept,
  defaultValue,
  onUploaded,
  method = 'POST'
}) => {
  const { progress, uploading, upload } = useFileUpload(endpoint, method);
  const doUpload = async (file: File) => {
    const f = await upload(file);
    onUploaded(f);
  };

  return (
    <LocalFormFile
      label={label}
      accept={accept}
      defaultValue={defaultValue}
      onUpload={doUpload}
      uploading={uploading}
      renderLoader={() => <CircularProgressWithLabel value={progress} />}
    />
  );
};

export default FormFile;
