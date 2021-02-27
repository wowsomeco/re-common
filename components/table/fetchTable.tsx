import Pagination from '@material-ui/core/Pagination';
import Skeleton from '@material-ui/core/Skeleton';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import * as React from 'react';

import { CommonProps } from '~w-common/components';
import { Headline } from '~w-common/components/typography';
import useFetchList, { FetchListState } from '~w-common/hooks/useFetchList';
import useTableAction from '~w-common/hooks/useTableAction';

import { Btn } from '../btn';
import { Table } from './table';

export interface TableData<T> {
  header: string;
  row: (t: T) => React.ReactNode;
}

export const Td: React.FC<{ dataHeader?: string } & CommonProps> = ({
  dataHeader,
  children,
  className,
  style
}) => {
  return (
    <td
      className={clsx(
        className,
        'text-gray-500 text-right px-4 py-2 md:text-center'
      )}
      style={style}
      data-header={dataHeader}
    >
      {children}
    </td>
  );
};

export interface FetchTableProps<T> extends CommonProps {
  idKey?: string;
  title: string;
  endpoint: string;
  endpointCount: string;
  /* if supplied, then whenever the row gets clicked
   * it will be added in between the cur pathname and the id
   * e.g {pathname}/{detailsRoute}/:id
   */
  detailsRoute?: string;
  placeholder?: React.ReactNode;
  items: TableData<T>[];
  itemPerPage?: number;
  action?: React.ReactNode;
}

/**
 * The table that the data gets fetched from the server.
 * only use this for the `online` table.
 * also ensure there is an endpoint to get the count of all the items in the db too (for pagination purpose)
 */
export const FetchTable = <T extends Record<string, any>>(
  props: FetchTableProps<T>
) => {
  const {
    idKey = 'id',
    title,
    endpoint,
    endpointCount,
    detailsRoute,
    items,
    itemPerPage = 5,
    action,
    ...other
  } = props;

  const { toDetail, toNew } = useTableAction({
    detailsRoute
  });

  const { result = [], loading, count, page, setPage } = useFetchList<T>(
    endpoint,
    endpointCount,
    new FetchListState(itemPerPage)
  );

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return loading ? (
    <div className='w-full mt-5'>
      <div className='flex justify-between items-center'>
        <Skeleton width={50} />
        <Skeleton width={50} />
      </div>
      <Skeleton />
      <Skeleton animation={false} />
      <Skeleton animation='wave' />
    </div>
  ) : (
    <>
      <Headline
        rightSlot={
          <Btn
            type='button'
            variant='contained'
            color='primary'
            loading={loading}
            onClick={toNew}
          >
            Tambah
          </Btn>
        }
      >
        {title}
      </Headline>
      <Table
        {...other}
        className='bg-white shadow rounded w-full'
        data={result}
        header={
          <tr>
            {items.map((item) => (
              <th key={nanoid()} className='px-2 py-4'>
                {item.header}
              </th>
            ))}
            {action ? <th className='px-2 py-4'>Action</th> : null}
          </tr>
        }
        eachRow={(data, i) => (
          <tr
            onClick={() => toDetail(data?.[idKey])}
            onKeyPress={(e) =>
              e.key === 'Enter' ? toDetail(data?.[idKey]) : null
            }
            key={i}
            tabIndex={0}
            className='border-t border-gray-100 hover:bg-gray-50 focus:bg-blue-50 cursor-pointer'
          >
            {items.map((item) => (
              <Td key={nanoid()} dataHeader={item.header}>
                {item.row(data)}
              </Td>
            ))}
            {action}
          </tr>
        )}
      />
      <div className='mt-5 flex justify-end'>
        <Pagination
          count={count}
          variant='outlined'
          color='primary'
          page={page}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
