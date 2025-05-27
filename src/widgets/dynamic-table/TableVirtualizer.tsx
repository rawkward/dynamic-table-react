import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import type { User, UsersResponse } from "@/shared/api/users.ts";
import { useEffect, useRef } from "react";
import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

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
  hasNextPage,
  fetchMore,
  isFetching,
  isLoading,
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
      <div className="h-[600px] flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <div ref={tableContainerRef} className="h-[600px] overflow-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-white z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left p-4 border-b bg-gray-50"
                  style={{ width: header.getSize() }}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow: VirtualItem) => {
            const row = rows[virtualRow.index] as Row<User>;
            return (
              <tr
                key={row.id}
                style={{
                  position: "absolute",
                  transform: `translateY(${virtualRow.start}px)`,
                  width: "100%",
                }}
                className="hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-4 border-b"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {isFetching && (
        <div className="p-4 text-center">
          <div>Загружаем еще данные...</div>
        </div>
      )}
    </div>
  );
};
