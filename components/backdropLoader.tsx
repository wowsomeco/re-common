import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';

const BackdropLoader: React.FC<{ open: boolean }> = ({ open }) => (
  <Backdrop
    transitionDuration={0}
    className='text-white'
    style={{ zIndex: 1200 + 1 }}
    open={open}
  >
    <CircularProgress color='inherit' />
  </Backdrop>
);

export default BackdropLoader;
