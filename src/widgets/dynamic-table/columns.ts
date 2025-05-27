import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/shared/api/users.ts";

export const generateColumns = (sampleData: User): ColumnDef<User>[] => {
  if (!sampleData) return [];

  return Object.keys(sampleData).map((key) => ({
    accessorKey: key,
    header: key.replace(/_/g, " ").toUpperCase(),
    size: 150,
    cell: ({ row }) => {
      const value = row.getValue(key);
      if (typeof value === "string" && key.endsWith("_date")) {
        return new Date(value).toLocaleDateString();
      }
      return value?.toString() ?? "";
    },
  }));
};
