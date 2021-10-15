import Button, { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';

import { SpinningCircles } from '~w-common/components';

export interface BtnProps extends ButtonProps<any> {
  loading?: boolean;
  loadingColor?: string;
}

/**
 * Wrapper component for the material-ui Button with some additional props.
 *
 * when loading is true, the button is disabled automagically and a circular progress will show.
 */
export const Btn: React.FC<BtnProps> = ({
  loading = false,
  loadingColor = '#6c5ce7',
  children,
  ...btnProps
}) => {
  return (
    <div className='relative'>
      <Button disabled={loading} {...btnProps}>
        {children}
      </Button>
      {loading && (
        <SpinningCircles
          style={{ transform: 'translate(-50%,-50%)' }}
          className='absolute top-1/2 left-1/2'
          fillColor={loadingColor}
          size={24}
        />
      )}
    </div>
  );
};
