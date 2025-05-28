import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import type { Table, Row } from "@tanstack/react-table";
import { useRef, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import type { User, UsersResponse } from "@/shared/api/users.ts";
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/Table/table.tsx";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/ui/components/Button/button";

type TableVirtualizerProps = {
  table: Table<User>;
  totalCount: number;
  isFetching: boolean;
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchMore: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<UsersResponse>>>;
};

export const TableVirtualizer = ({
  table,
  totalCount,
  fetchMore,
  isLoading,
  hasNextPage,
  isFetching,
}: TableVirtualizerProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index >= rows.length - 1 && hasNextPage && !isFetching) {
      fetchMore();
    }
  }, [virtualItems, rows.length, hasNextPage, isFetching, fetchMore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {rows.length} of {totalCount} users
        </div>
        {isFetching && (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            Loading more...
          </div>
        )}
      </div>

      <div
        ref={tableContainerRef}
        className="h-[600px] overflow-auto border rounded-md"
      >
        <ShadcnTable className="w-full table-fixed">
          <TableHeader className="top-0 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 bg-background"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex items-center justify-center gap-2 cursor-pointer select-none hover:text-foreground"
                            : "flex items-center justify-center gap-2"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            {header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {virtualItems.map((virtualRow: VirtualItem) => {
              const row = rows[virtualRow.index] as Row<User>;
              return (
                <TableRow
                  key={row.id}
                  className="absolute hover:bg-muted/50"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </ShadcnTable>
      </div>
    </div>
  );
};
