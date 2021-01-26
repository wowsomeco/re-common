import * as React from 'react';

import { SpinningCircles } from './loaders';
import { Modal, ModalProps } from './modal';

export const OverlayLoading: React.FC<ModalProps> = (props) => {
  return (
    <Modal {...props}>
      <div className='relative w-full h-full'>
        <SpinningCircles
          style={{ transform: 'translate(-50%,-50%)' }}
          className='absolute top-1/2 left-1/2 text-center'
        />
      </div>
    </Modal>
  );
};
