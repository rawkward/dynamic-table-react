import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/entities/user/types.ts";
import type { ReactNode } from "react";

export const generateColumns = (
  sampleData?: Partial<User>,
): ColumnDef<User>[] => {
  if (!sampleData) return [];

  return Object.keys(sampleData)
    .filter((key) => !"id".includes(key))
    .map((key) => {
      const column: ColumnDef<User> = {
        accessorKey: key,
        header: formatHeader(key),
        size: getColumnWidth(key),
        enableSorting: true,
        minSize: getColumnWidth(key),
        maxSize: getColumnWidth(key),
        cell: ({ row }) => {
          const value = row.getValue(key);
          return formatCellValue(key, value as string | number);
        },
      };

      return column;
    });
};

function formatHeader(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getColumnWidth(key: string): number {
  const widthMap: Record<string, number> = {
    user_id: 80,
    first_name: 120,
    last_name: 120,
    age: 80,
    gender: 100,
    email: 220,
    country: 130,
    city: 120,
    interests: 100,
    relationship_status: 140,
    education_level: 130,
    job_title: 180,
    profile_created_date: 120,
    last_login_date: 120,
    profile_picture_url: 80,
  };

  return widthMap[key] || 150;
}

function formatCellValue(
  key: string,
  value: string | number,
): ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (key.endsWith("_date") && typeof value === "string") {
    try {
      const date = new Date(value);
      return (
        <div className="text-sm leading-tight">
          {date.toLocaleDateString("en-UK", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
      );
    } catch {
      return <span className="text-muted-foreground">Invalid date</span>;
    }
  }

  if (key === "email") {
    return (
      <div className="text-sm leading-tight break-all">
        <a
          href={`mailto:${value}`}
          className="text-primary hover:underline"
          title={String(value)}
        >
          {String(value)}
        </a>
      </div>
    );
  }

  const stringValue = String(value);

  if (stringValue.length > 20) {
    return (
      <div
        className="text-sm leading-tight text-ellipsis hyphens-auto"
        title={stringValue}
      >
        {stringValue}
      </div>
    );
  }

  return <div className="text-sm leading-tight">{stringValue}</div>;
}
