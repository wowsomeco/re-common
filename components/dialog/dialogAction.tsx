import * as React from 'react';

import { Btn } from '~w-common/components/btn';

export interface DialogActionProps {
  isNew: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit?: (...args: any[]) => void;
}

const DialogAction: React.FC<DialogActionProps> = ({
  isNew,
  loading,
  onCancel,
  onSubmit
}) => (
  <div className='w-full flex justify-between sticky bottom-0 right-0'>
    <Btn
      type='button'
      variant='text'
      color='secondary'
      loading={loading}
      onClick={onCancel}
    >
      Cancel
    </Btn>
    <Btn
      onClick={onSubmit}
      type={onSubmit ? 'button' : 'submit'}
      variant='contained'
      color='primary'
      loading={loading}
    >
      {isNew ? 'Submit' : 'Update'}
    </Btn>
  </div>
);

export default DialogAction;
