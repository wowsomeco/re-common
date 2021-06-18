import * as React from 'react';

import { FilterField, FilterSubmit } from '~app/components/filter';
import { CommonProps } from '~w-common/components';

interface TableData<T> {
  header: string;
  row: (t: T) => React.ReactNode;
}

interface ActionCallback<T> {
  item: T;
  setDisabled: (flag: boolean) => void;
}

interface TablePropsBase<T> extends CommonProps {
  disableHeadline?: boolean;
  title?: string;
  flexWrapHeadline?: boolean;
  addLabel?: string;
  items: TableData<T>[];
  itemPerPage?: number;
  onRowClick?: (data: T) => void;
  rightSlot?: React.ReactNode;
  detailsRoute?: string;
}

export interface DataTableProps<T> extends TablePropsBase<T> {
  idKey?: string;
  data: T[];
  placeholder?: React.ReactNode;
  disabled?: boolean;
  action?: (cb: ActionCallback<T>) => React.ReactNode;
  loading?: boolean;
  count?: number;
  onPageChange?: (page: number) => void;
  singleColumn?: boolean;
}

export interface FetchListTableProps<T> extends TablePropsBase<T> {
  endpoint: string;
  filterFields?: FilterField[];
  renderCustomHeadline?: (onFilter: FilterSubmit) => React.ReactNode;
}
