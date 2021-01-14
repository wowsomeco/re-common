import React, { FunctionComponent } from 'react';
import { TW_CENTER } from '../scripts';
import { SpinningCircles } from './loaders';
import { Modal, ModalProps } from './modal';

interface OverlayLoadingProps extends ModalProps {
  open: boolean;
}

export const OverlayLoading: FunctionComponent<OverlayLoadingProps> = (props) => {
  const { open, ...modalProps } = props;

  return (
    open ?
      <Modal {...modalProps}>
        <div className={TW_CENTER}>
          <SpinningCircles />
        </div>
      </Modal>
      : <></>
  );
};
