import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TableVirtualizer } from "../../features/users-table/ui/TableVirtualizer.tsx";
import type { User } from "@/entities/user/types.ts";
import { generateColumns } from "../../features/users-table/ui/columns.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/Card/card.tsx";
import { fetchUsers } from "@/features/users-table/api/fetch-users.ts";

const PAGE_SIZE = 50;

export const DynamicTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, fetchNextPage, isFetching, isLoading, error, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users", sorting],
      queryFn: ({ pageParam = 0 }) =>
        fetchUsers(pageParam * PAGE_SIZE, PAGE_SIZE, sorting),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < PAGE_SIZE) return undefined;
        return allPages.length;
      },
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
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
    enableSortingRemoval: true,
  });

  const totalCount = data?.pages[0]?.meta.totalRowCount || 0;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Users
          </CardTitle>
          <CardDescription>
            Failed to load user data. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Table</CardTitle>
      </CardHeader>
      <CardContent>
        <TableVirtualizer
          table={table}
          totalCount={totalCount}
          isFetching={isFetching}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          fetchMore={fetchNextPage}
        />
      </CardContent>
    </Card>
  );
};
