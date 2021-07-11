import { LinearProgress } from '@material-ui/core';
import Pagination from '@material-ui/core/Pagination';
import Skeleton from '@material-ui/core/Skeleton';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import * as React from 'react';

import { CommonProps } from '~w-common/components';
import { Btn } from '~w-common/components/btn';
import { Table } from '~w-common/components/table/table';
import { Headline } from '~w-common/components/typography';
import useTableAction from '~w-common/hooks/useTableAction';

export interface TableData<T> {
  header: string;
  row: (t: T) => React.ReactNode;
}

export interface ActionCallback<T> {
  item: T;
  setDisabled: (flag: boolean) => void;
}

export interface DataTableProps<T> extends CommonProps {
  idKey?: string;
  disableHeadline?: boolean;
  title?: string;
  flexWrapHeadline?: boolean;
  addLabel?: string;
  items: TableData<T>[];
  itemPerPage?: number;
  onRowClick?: (data: T) => void;
  rightSlot?: React.ReactNode;
  detailsRoute?: string;
  data: T[];
  placeholder?: React.ReactNode;
  disabled?: boolean;
  action?: (cb: ActionCallback<T>) => React.ReactNode;
  loading?: boolean;
  count?: number;
  onPageChange?: (page: number) => void;
  singleColumn?: boolean;
}

// code from https://stackoverflow.com/a/42761393
function paginate(array: any[], pageSize: number, pageNumber: number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export const Td: React.FC<
  { dataHeader?: string; singleColumn?: boolean } & CommonProps
> = ({ dataHeader, children, className, style, singleColumn = false }) => {
  return (
    <td
      className={clsx(
        className,
        'text-gray-500 px-4 py-2 md:text-left',
        singleColumn ? 'text-left' : 'text-right'
      )}
      style={style}
      data-header={!singleColumn ? dataHeader : undefined}
    >
      {children}
    </td>
  );
};

/**
 * A clone of FetchTable for local data
 */
const LocalTable = <T extends Record<string, any>>(
  props: DataTableProps<T>
) => {
  const {
    idKey = 'id',
    data = [],
    title,
    flexWrapHeadline = false,
    addLabel = 'Add',
    detailsRoute,
    items,
    itemPerPage = 5,
    action,
    onRowClick,
    loading = false,
    rightSlot,
    count,
    onPageChange,
    disableHeadline = false,
    singleColumn,
    ...other
  } = props;

  const [disabled, setDisabled] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [dataInPage, setDataInPage] = React.useState(data);

  const { toDetail, toNew } = useTableAction({ detailsRoute });

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (onPageChange) onPageChange(value);
  };

  React.useEffect(() => {
    if (!count) {
      const newDataInPage = paginate([...data], itemPerPage, page);
      setDataInPage(newDataInPage);
    } else {
      setDataInPage(data);
    }
  }, [page, data]);

  const pageCount = count
    ? Math.ceil(count / itemPerPage)
    : Math.ceil(data.length / itemPerPage);

  const onSingleRowClick = (data) =>
    onRowClick ? onRowClick(data) : toDetail(data?.[idKey]);

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
      {!disableHeadline && (
        <Headline
          textClassName={
            flexWrapHeadline ? 'text-gray-500 flex-wrap' : undefined
          }
          rightSlot={
            rightSlot ? (
              rightSlot
            ) : (
              <Btn
                type='button'
                variant='contained'
                color='primary'
                onClick={toNew}
              >
                {addLabel}
              </Btn>
            )
          }
        >
          {title}
        </Headline>
      )}
      <div className='w-full'>
        {disabled ? <LinearProgress /> : null}
        <Table
          {...other}
          className={clsx(
            'bg-white shadow rounded w-full',
            disabled && 'pointer-events-none'
          )}
          data={dataInPage}
          header={
            <tr>
              {items.map((item) => (
                <th key={nanoid()} className='px-2 py-4 md:text-left'>
                  {item.header}
                </th>
              ))}
              {action ? <th className='px-2 py-4'>Action</th> : null}
            </tr>
          }
          eachRow={(data, i) => (
            <tr
              onClick={() => onSingleRowClick(data)}
              onKeyPress={(e) =>
                e.key === 'Enter' ? onSingleRowClick(data) : null
              }
              key={i}
              tabIndex={0}
              className='border-t border-gray-100 hover:bg-gray-50 focus:bg-blue-50 cursor-pointer'
            >
              {items.map((item) => (
                <Td
                  key={nanoid()}
                  dataHeader={item.header}
                  singleColumn={singleColumn}
                >
                  {item.row(data)}
                </Td>
              ))}
              {action?.({ setDisabled, item: data })}
            </tr>
          )}
        />
      </div>
      <div className='mt-5 flex justify-end'>
        <Pagination
          count={pageCount}
          variant='outlined'
          color='primary'
          page={page}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default LocalTable;
