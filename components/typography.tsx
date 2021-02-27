import clsx from 'clsx';
import * as React from 'react';

export const Headline: React.FC<{
  textClassName?: string;
  rightSlot?: React.ReactNode;
}> = ({ textClassName = 'text-gray-500', rightSlot, children }) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-between w-full py-3 border-b mb-3',
        textClassName
      )}
    >
      <p className='font-bold text-lg uppercase'>{children}</p>
      {rightSlot}
    </div>
  );
};
