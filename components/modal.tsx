import React, { FunctionComponent } from 'react';
import { CommonProps } from './common';
import { toRgba } from '../scripts';

export interface ModalProps extends CommonProps {
  /** the BG color in hex e.g. #ecf0f1 */
  color?: string;
  /** The opacity of the BG */
  opacity?: number;
}

export const Modal: FunctionComponent<ModalProps> = ({ color, opacity, children }) => {
  const rgba = toRgba(color || '#000000', opacity || 0.3);

  return (
    <div style={{ zIndex: 9999, backgroundColor: rgba }} className="absolute w-full h-full top-0 left-0">
      {children}
    </div>
  );
};