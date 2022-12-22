import * as React from 'react';
import ReactDOM from 'react-dom';
import UseKey from 'react-use/lib/component/UseKey';
import { KeyFilter } from 'react-use/lib/useKey';

import { ZINDEX_MODAL } from '~w-common/scripts/constants';

import { toRgba } from '../scripts';
import { CommonProps } from './common';

export type KeyTrigger = [KeyFilter, () => void];

export interface ModalProps extends CommonProps {
  open: boolean;
  /** the BG color in hex e.g. #ecf0f1 */
  color?: string;
  /** The opacity of the BG */
  opacity?: number;
  keyTriggers?: KeyTrigger[];
  appendOnBody?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  color = '#000000',
  opacity = 0.3,
  keyTriggers = [],
  appendOnBody = false,
  children
}) => {
  const rgba = toRgba(color, opacity);

  const component: React.ReactElement = (
    <div
      style={{ zIndex: ZINDEX_MODAL, backgroundColor: rgba }}
      className='absolute w-full h-full top-0 left-0'
    >
      {children}
    </div>
  );

  return (
    <>
      {keyTriggers.map((k) => (
        <UseKey key={k[0]} filter={k[0]} fn={k[1]} />
      ))}
      {open ? (
        appendOnBody ? (
          ReactDOM.createPortal(component, document.body)
        ) : (
          component
        )
      ) : (
        <></>
      )}
    </>
  );
};
