import * as React from 'react';
import { useMountedState } from 'react-use';

import { Btn } from '~w-common/components/btn';
import Filter, { FilterField, FilterSubmit } from '~w-common/components/filter';
import LocalTable, {
  DataTableProps
} from '~w-common/components/table/localTable';
import { Headline } from '~w-common/components/typography';
import { useFetchJson } from '~w-common/hooks';
import useTableAction from '~w-common/hooks/useTableAction';

// list response with count
type ListResponseModel<T> = {
  data: T[];
  count: number;
};

export interface QueryURL {
  limit: number;
  offset: number;
}

export interface FetchTableProps<T> extends Omit<DataTableProps<T>, 'data'> {
  endpoint: string;
  endpointCount?: string;
  filterFields?: FilterField[];
  renderCustomHeadline?: (onFilter: FilterSubmit) => React.ReactNode;
}

/**
 * Table with fetch functionality
 * Support 2 type of endpoint
 * - endpoint contain { data, count }
 * - double endpoint: endpoint with data + endpoint with count (dont support filtering count)
 */
const FetchTable = <T extends Record<string, any>>(
  props: FetchTableProps<T>
) => {
  const {
    disableHeadline,
    title,
    flexWrapHeadline = false,
    addLabel = 'Add',
    rightSlot,
    detailsRoute,
    endpoint,
    endpointCount,
    items,
    filterFields,
    itemPerPage = 5,
    onRowClick,
    renderCustomHeadline,
    ...otherProps
  } = props;
  const { toNew } = useTableAction({ detailsRoute });
  const { result, loading, submit } = useFetchJson<ListResponseModel<T> | T>(
    { method: 'GET', endpoint },
    true
  );

  const isMounted = useMountedState();

  /**
   * COUNT: get count if endpointCount provided
   */
  const [count, setCount] = React.useState<number>();
  const { submit: fetchCount, loading: countLoading } = useFetchJson<
    Record<string, number>
  >({
    method: 'GET',
    endpoint: endpointCount || ''
  });

  React.useEffect(() => {
    (async () => {
      if (!endpointCount) return;
      const { data } = await fetchCount();
      if (isMounted()) setCount(data?.count);
    })();
  }, []);

  /**
   * QUERY: filter & pagination
   */
  const [queryURL, setQueryURL] = React.useState<QueryURL>({
    limit: itemPerPage,
    offset: 0
  });
  const [filterQuery, setFilterQuery] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      // convert queryURL object into query string
      const queryStart = endpoint.includes('?') ? '&' : '?';
      const limitOffset = Object.keys(queryURL)
        .map((queryName) => `${queryName}=${queryURL[queryName]}`)
        .join('&');
      const filter = filterQuery ? `&${filterQuery}` : '';

      const query = queryStart + limitOffset + filter;
      await submit({ query });
    })();
  }, [queryURL, filterQuery, endpoint]);

  const onFilterBase: FilterSubmit = async (filterQuery, onClose) => {
    setFilterQuery(filterQuery);
    onClose();
  };

  // Prevent rerender so can keep filter form value
  const onFilter = React.useCallback(onFilterBase, []);

  const onPageChange = (page: number) => {
    setQueryURL((prevVal) => ({
      ...prevVal,
      offset: (page - 1) * prevVal.limit
    }));
  };

  const renderHeadline = (): React.ReactNode => {
    // Headline Disabled
    if (disableHeadline) return null;

    // Custom Headline
    if (renderCustomHeadline) return renderCustomHeadline(onFilter);

    // Default Headline
    return (
      <Headline
        textClassName={flexWrapHeadline ? 'text-gray-500 flex-wrap' : undefined}
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
        <span className='flex items-center'>
          {title}{' '}
          {!!filterFields && !count && (
            <Filter
              className='ml-2'
              onSubmit={onFilter}
              fields={filterFields}
            ></Filter>
          )}
        </span>
      </Headline>
    );
  };

  const data = count ? result : result?.data;
  return (
    <>
      {renderHeadline()}
      <LocalTable<T>
        disableHeadline={true}
        data={data || []}
        title={title}
        itemPerPage={itemPerPage}
        items={items}
        onRowClick={onRowClick}
        loading={loading || countLoading}
        rightSlot={rightSlot}
        onPageChange={onPageChange}
        count={endpointCount ? count : result?.count}
        detailsRoute={detailsRoute}
        {...otherProps}
      />
    </>
  );
};

export default FetchTable;
