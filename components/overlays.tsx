import React, { FunctionComponent } from 'react';
import { TW_CENTER } from '../scripts';
import { SpinningCircles } from './loaders';
import { Modal } from './modal';

interface OverlayLoadingProps {
  open: boolean;
}

export const OverlayLoading: FunctionComponent<OverlayLoadingProps> = ({ open }) => {
  return (
    open ?
      <Modal>
        <div className={TW_CENTER}>
          <SpinningCircles />
        </div>
      </Modal>
      : <></>
  );
};
