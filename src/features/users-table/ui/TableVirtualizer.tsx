import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import type { Table, Row } from "@tanstack/react-table";
import { useRef, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import type { User, UsersResponse } from "@/entities/user/types.ts";
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
import { Button } from "@/shared/ui/components/Button/button.tsx";

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
    estimateSize: () => 80,
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

  const totalTableWidth = table.getAllColumns().reduce((acc, column) => {
    return acc + (column.getSize() || 150);
  }, 0);

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
        <ShadcnTable
          className="table-fixed border-collapse"
          style={{
            width: `${totalTableWidth}px`,
            minWidth: `${totalTableWidth}px`,
          }}
        >
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 bg-background"
                    style={{
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex items-center justify-center gap-2 cursor-pointer select-none hover:text-foreground px-2"
                            : "flex items-center justify-center gap-2 px-2"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="text-xs font-medium text-center leading-tight">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            {header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronsUpDown className="h-3 w-3" />
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
                  className="absolute hover:bg-muted/50 border-b border-border"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-2 align-top"
                      style={{
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                    >
                      <div className="w-full h-full overflow-hidden">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
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
