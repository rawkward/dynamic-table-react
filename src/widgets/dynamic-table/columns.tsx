import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/shared/api/users.ts";
import { Badge } from "@/shared/ui/components/Badge/badge.tsx";

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
        cell: ({ row }) => {
          const value = row.getValue(key);
          return formatCellValue(key, value as string | number | Date);
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
    email: 200,
    age: 80,
    country: 120,
    city: 120,
    interests: 180,
    relationship_status: 140,
    education_level: 140,
    job_title: 160,
    profile_created_date: 120,
    last_login_date: 120,
    profile_picture_url: 60,
  };

  return widthMap[key] || 150;
}

function formatCellValue(
  key: string,
  value: string | number | Date,
): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (key.endsWith("_date") && typeof value === "string") {
    try {
      const date = new Date(value);
      return (
        <span className="text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    } catch {
      return <span className="text-muted-foreground">Invalid date</span>;
    }
  }

  if (key === "email") {
    return (
      <a
        href={`mailto:${value}`}
        className="text-primary hover:underline text-sm"
      >
        {String(value)}
      </a>
    );
  }

  if (key === "relationship_status") {
    const statusColors: Record<string, string> = {
      single: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      married:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      divorced:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      widowed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };

    const colorClass =
      statusColors[String(value).toLowerCase()] || "bg-gray-100 text-gray-800";

    return (
      <Badge variant="secondary" className={colorClass}>
        {String(value)}
      </Badge>
    );
  }

  if (key === "age") {
    return <span className="font-medium">{String(value)} y/o</span>;
  }

  if (key === "profile_picture_url") {
    return value ? (
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-xs font-medium">IMG</span>
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">—</span>
      </div>
    );
  }

  const stringValue = String(value);
  if (stringValue.length > 30) {
    return (
      <span title={stringValue} className="text-sm">
        {stringValue.substring(0, 27)}...
      </span>
    );
  }

  return <span className="text-sm">{stringValue}</span>;
}
