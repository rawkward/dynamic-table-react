import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/shared/api/users.ts";

export const generateColumns = (
  sampleData?: Partial<User>,
): ColumnDef<User>[] => {
  if (!sampleData) return [];

  return Object.keys(sampleData).map((key) => ({
    accessorKey: key,
    header: key.replace(/_/g, " ").toUpperCase(),
    size: 150,
    cell: ({ row }) => {
      const value = row.getValue(key);
      const typedValue = value as string | number | Date;

      if (key.endsWith("_date") && typeof typedValue === "string") {
        return new Date(typedValue).toLocaleDateString();
      }
      return String(typedValue);
    },
  }));
};
