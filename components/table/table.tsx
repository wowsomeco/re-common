import clsx from 'clsx';
import * as React from 'react';

import { CommonProps } from '~w-common/components';

export interface TableProps<T> extends CommonProps {
  data: T[] | undefined;
  header: React.ReactElement;
  eachRow: (data: T, idx: number) => React.ReactElement;
  placeholder?: React.ReactNode;
}

/**
 * WIP
 */
export const Table = <T,>(props: TableProps<T>) => {
  const {
    data = [],
    header,
    eachRow,
    placeholder = 'No Data',
    className,
    ...other
  } = props;

  const rows: React.ReactElement[] = data?.map((d, i) => eachRow(d, i));

  return (
    <table className={clsx('table-auto', className)} {...other}>
      <thead className='sr-only md:not-sr-only'>{header}</thead>
      <tbody>
        {rows.length > 0 ? (
          rows
        ) : (
          <tr>
            <td
              colSpan={100}
              className='text-gray-400 text-right px-4 py-2 md:text-center'
            >
              {placeholder}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
