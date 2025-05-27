import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import type { Table, Row } from "@tanstack/react-table";
import { useRef, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import type { User, UsersResponse } from "@/shared/api/users.ts";
import type {
  FetchNextPageOptions, InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

type TableVirtualizerProps = {
  table: Table<User>
  totalCount: number
  isFetching: boolean
  isLoading: boolean
  fetchMore: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<UsersResponse>>>
};

export const TableVirtualizer = ({
  table,
  totalCount,
  fetchMore,
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

    if (lastItem.index >= rows.length - 1 && rows.length < totalCount) {
      fetchMore();
    }
  }, [virtualItems, rows.length, totalCount, fetchMore]);

  return (
    <div ref={tableContainerRef} className="h-[600px] overflow-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left p-4 border-b"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
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
    </div>
  );
};
