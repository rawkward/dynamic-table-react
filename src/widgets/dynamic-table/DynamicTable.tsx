import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TableVirtualizer } from "./TableVirtualizer";
import { type User, fetchUsers } from "@/shared/api/users.ts";
import { generateColumns } from "./columns";

const PAGE_SIZE = 50;

export const DynamicTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["users", sorting],
    queryFn: ({ pageParam = 0 }) =>
      fetchUsers(pageParam * PAGE_SIZE, PAGE_SIZE, sorting),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length ? allPages.length : undefined,
  });

  const columns = () => generateColumns(data?.pages[0]?.data[0]);

  const flatData = () => data?.pages.flatMap((page) => page.data) || [];

  const table = useReactTable<User>({
    data: flatData(),
    columns: columns(),
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
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
