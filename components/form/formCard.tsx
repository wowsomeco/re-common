import clsx from 'clsx';
import * as React from 'react';

import { CommonProps } from '~w-common/components';
import { Headline } from '~w-common/components/typography';

const FormCard: React.FC<CommonProps & { title: string }> = ({
  className,
  style,
  title,
  children
}) => {
  return (
    <div
      className={clsx(
        'border bg-white p-3 md:p-5 flex flex-col rounded',
        className
      )}
      style={style}
    >
      <Headline textClassName='text-blue-400'>{title}</Headline>
      {children}
    </div>
  );
};

export default FormCard;
