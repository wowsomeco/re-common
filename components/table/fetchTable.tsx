import { LinearProgress } from '@material-ui/core';
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

export interface ActionCallback<T> {
  item: T;
  setDisabled: (flag: boolean) => void;
  reload: () => void;
}

export interface FetchTableProps<T> extends CommonProps {
  idKey?: string;
  title: string;
  addLabel?: string;
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
  disabled?: boolean;
  action?: (cb: ActionCallback<T>) => React.ReactNode;
  onRowClick?: (row: T) => void;
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
    addLabel = 'Add',
    endpoint,
    endpointCount,
    detailsRoute,
    items,
    itemPerPage = 5,
    action,
    onRowClick,
    ...other
  } = props;

  const [disabled, setDisabled] = React.useState(false);

  const { toDetail, toNew } = useTableAction({ detailsRoute });

  const {
    result = [],
    loading,
    count,
    page,
    setPage,
    doFetch: reload
  } = useFetchList<T>(endpoint, endpointCount, new FetchListState(itemPerPage));

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRowClick = (model: T) =>
    onRowClick ? onRowClick(model) : toDetail(model?.[idKey]);

  return loading ? (
    <div className='w-full mt-5'>
      <div className='flex justify-between items-center'>
        <Skeleton height={35} width={100} />
        <Skeleton height={35} width={50} />
      </div>
      <Skeleton animation='wave' height={70} />
      <Skeleton animation={false} />
      <Skeleton />
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
            {addLabel}
          </Btn>
        }
      >
        {title}
      </Headline>
      <div className='w-full'>
        {disabled ? <LinearProgress /> : null}
        <Table
          {...other}
          className={clsx(
            'bg-white shadow rounded w-full',
            disabled && 'pointer-events-none'
          )}
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
              onClick={() => handleRowClick(data)}
              onKeyPress={(e) =>
                e.key === 'Enter' ? handleRowClick(data) : null
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
              {action?.({ reload, setDisabled, item: data })}
            </tr>
          )}
        />
      </div>
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
