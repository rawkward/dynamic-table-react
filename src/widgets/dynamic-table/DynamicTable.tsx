import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableVirtualizer } from "./TableVirtualizer";
import { type User, fetchUsers } from "@/shared/api/users.ts";
import { generateColumns } from "./columns";

const PAGE_SIZE = 50;

export const DynamicTable = () => {
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam = 0 }) =>
      fetchUsers(pageParam * PAGE_SIZE, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length ? allPages.length : undefined,
  });

  const columns = useMemo(() => {
    return generateColumns(data?.pages[0]?.data[0]);
  }, [data?.pages]);

  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data?.pages]);

  const table = useReactTable<User>({
    data: flatData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const totalCount = data?.pages[0]?.meta.totalRowCount || 0;

  return (
    <TableVirtualizer
      table={table}
      totalCount={totalCount}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchMore={fetchNextPage}
    />
  );
};
