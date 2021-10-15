import { LinearProgress, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import clsx from 'clsx';
import * as React from 'react';
import { IoChevronBackCircle } from 'react-icons/io5';

import { CommonProps } from '~w-common/components';
import { FileModel } from '~w-common/hooks/useFileUpload';
import { TW_TOP_LEFT } from '~w-common/scripts';
import {
  MIME_IMAGES,
  MIME_OFFICE_DOCS,
  MIME_PDF,
  MIME_TEXTS
} from '~w-common/scripts/mimeTypes';

const SELF_CENTER =
  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';

const IFrameWithLoader: React.FC<CommonProps & { title: string; src: string }> =
  ({ title, src, className, ...other }) => {
    const [loading, setLoading] = React.useState(true);

    return (
      <>
        {loading ? <LinearProgress className={TW_TOP_LEFT} /> : null}
        <iframe
          {...other}
          className={clsx(SELF_CENTER, className)}
          title={title}
          src={src}
          frameBorder='0'
          onLoad={() => setLoading(false)}
        />
      </>
    );
  };

export interface FilePreviewProps {
  open: boolean;
  setOpen: (flag: boolean) => void;
  file: FileModel;
}

export interface Viewer {
  acceptedFiles: string[];
  getView(file: FileModel): React.ReactNode;
}

class ImgViewer implements Viewer {
  acceptedFiles = [...MIME_IMAGES];

  getView(file: FileModel): React.ReactNode {
    return (
      <img
        className={clsx(
          'h-auto w-full max-h-full max-w-full object-contain md:w-2/4',
          SELF_CENTER
        )}
        src={file.url}
        alt={file.name}
      />
    );
  }
}

class OfficeViewer implements Viewer {
  acceptedFiles = [...MIME_OFFICE_DOCS];

  getView(file: FileModel): React.ReactNode {
    const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      file.url
    )}`;

    return (
      <IFrameWithLoader
        className='w-full h-full md:w-3/4 md:h-5/6'
        title={file.name}
        src={src}
      />
    );
  }
}

class TextsViewer implements Viewer {
  acceptedFiles = [...MIME_PDF, ...MIME_TEXTS];

  getView(file: FileModel): React.ReactNode {
    // use iframe for now, since google docs viewer doesnt always guarantee to show.
    // this might not work on mobile browsers.
    // TODO: check on mobile and use google docs viewer there.
    return (
      <IFrameWithLoader
        className='w-full h-full md:w-3/4 md:h-5/6'
        title={file.name}
        src={file.url}
      />
    );
  }
}

const viewers: Viewer[] = [
  new ImgViewer(),
  new OfficeViewer(),
  new TextsViewer()
];

const FilePreview: React.FC<FilePreviewProps> = ({ open, setOpen, file }) => {
  const close = () => setOpen(false);

  const viewer: React.ReactNode = viewers
    .find((x) => x.acceptedFiles.includes(file.type))
    ?.getView(file) || (
    <div className={SELF_CENTER}>
      <p className='text-white'>No Viewers available for this file :(</p>
    </div>
  );

  return (
    <Modal open={open} onClose={close}>
      <div>
        {viewer}
        <div className={TW_TOP_LEFT}>
          <Tooltip title='Go back' placement='right' arrow>
            <IconButton className='md:m-1' onClick={close} aria-label='Go back'>
              <IoChevronBackCircle
                size={32}
                className='text-red-300 md:text-white'
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
};

export default FilePreview;
