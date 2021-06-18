import * as React from 'react';

import Filter, { FilterSubmit } from '~app/components/filter';
import LocalTable from '~app/components/table/localTable';
import { Btn } from '~w-common/components/btn';
import { Headline } from '~w-common/components/typography';
import { useFetchJson } from '~w-common/hooks';
import useTableAction from '~w-common/hooks/useTableAction';

import { FetchListTableProps } from '~w-common/components/table/types';

// list response with count
type ListResponseModel<T> = {
  data: T[];
  count: number;
};

interface QueryURL {
  limit: number;
  offset: number;
}

const FetchListTable = <T extends Record<string, any>>(
  props: FetchListTableProps<T>
) => {
  const {
    disableHeadline,
    title,
    flexWrapHeadline = false,
    addLabel = 'Add',
    rightSlot,
    detailsRoute,
    endpoint,
    items,
    filterFields,
    itemPerPage = 5,
    onRowClick,
    renderCustomHeadline
  } = props;

  const { toNew } = useTableAction({ detailsRoute });

  const { result, loading, submit } = useFetchJson<ListResponseModel<T>>(
    { method: 'GET', endpoint },
    true
  );

  const [queryURL, setQueryURL] = React.useState<QueryURL>({
    limit: itemPerPage,
    offset: 0
  });

  const [filterQuery, setFilterQuery] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      // convert queryURL object into query string
      const query =
        '?' +
        filterQuery +
        '&' +
        Object.keys(queryURL)
          .map((queryName) => `${queryName}=${queryURL[queryName]}`)
          .join('&');

      await submit(undefined, query);
    })();
  }, [queryURL, filterQuery]);

  const onPageChange = (page: number) => {
    setQueryURL((prevVal) => ({
      ...prevVal,
      offset: (page - 1) * prevVal.limit
    }));
  };

  const onFilterBase: FilterSubmit = async (filterQuery, onClose) => {
    setFilterQuery(filterQuery);
    onClose();
  };

  // Prevent rerender so can keep filter form value
  const onFilter = React.useCallback(onFilterBase, []);

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
              type="button"
              variant="contained"
              color="primary"
              onClick={toNew}
            >
              {addLabel}
            </Btn>
          )
        }
      >
        <span className="flex items-center">
          {title}{' '}
          {!!filterFields && (
            <Filter
              className="ml-2"
              onSubmit={onFilter}
              fields={filterFields}
            ></Filter>
          )}
        </span>
      </Headline>
    );
  };

  return (
    <>
      {renderHeadline()}
      <LocalTable<T>
        disableHeadline={true}
        data={result?.data || []}
        title={title}
        itemPerPage={itemPerPage}
        items={items}
        onRowClick={onRowClick}
        loading={loading}
        rightSlot={rightSlot}
        onPageChange={onPageChange}
        count={result?.count}
        detailsRoute={detailsRoute}
      />
    </>
  );
};

export default FetchListTable;
