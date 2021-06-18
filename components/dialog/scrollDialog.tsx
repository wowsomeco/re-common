// source: https://material-ui.com/components/dialogs/#dialog
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';

interface ScrollDialogProps {
  openDialog?: boolean;
  onClose?: () => void;
  renderButton?: (
    onOpen: (scrollType: DialogProps['scroll']) => void
  ) => React.ReactNode;
  title?: string;
  content: React.ReactNode;
  renderActions?: (onClose: () => void) => React.ReactNode;
}

const ScrollDialog: React.FC<ScrollDialogProps> = ({
  openDialog = false,
  onClose,
  renderButton,
  title,
  content,
  renderActions
}) => {
  const [open, setOpen] = React.useState(openDialog);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen = (scrollType: DialogProps['scroll']) => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  React.useEffect(() => {
    setOpen(openDialog);
  }, [openDialog]);

  return (
    <div>
      {renderButton && renderButton(handleClickOpen)}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        classes={{
          paper: 'w-full'
        }}
      >
        {title && <DialogTitle id='scroll-dialog-title'>{title}</DialogTitle>}
        <DialogContent dividers={scroll === 'paper'}>
          {typeof content === 'string' ? (
            <DialogContentText
              id='scroll-dialog-description'
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              {content}
            </DialogContentText>
          ) : (
            content
          )}
        </DialogContent>
        {renderActions && (
          <DialogActions>{renderActions(handleClose)}</DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default ScrollDialog;
