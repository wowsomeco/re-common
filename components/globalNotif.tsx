import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import * as React from 'react';
import { FaWindowClose } from 'react-icons/fa';

import {
  NotifContent,
  useNotifProvider
} from '~w-common/contexts/notifContext';

const GlobalNotif: React.FC = () => {
  const { notif, theme } = useNotifProvider();

  const [state, setState] = React.useState<NotifContent | undefined>(undefined);

  const closeNotif = () => setState(undefined);

  React.useEffect(() => {
    const onTriggerNotif = (v: NotifContent | undefined) => setState(v);
    notif.subscribe(onTriggerNotif);

    return () => {
      notif.unsubscribe(closeNotif);
    };
  }, []);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={!!state?.msg}
      autoHideDuration={6000}
      onClose={closeNotif}
      message={state?.msg}
      ContentProps={{
        style: {
          fontWeight: 'bold',
          backgroundColor: theme[state?.state || 'info']
        }
      }}
      action={
        <>
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={closeNotif}
          >
            <FaWindowClose fontSize='small' />
          </IconButton>
        </>
      }
    />
  );
};

export default GlobalNotif;
