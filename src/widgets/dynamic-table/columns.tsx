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
        minSize: getColumnWidth(key),
        maxSize: getColumnWidth(key),
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
    email: 220,
    age: 80,
    gender: 100,
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
  value: string | number | Date,
): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (key.endsWith("_date") && typeof value === "string") {
    try {
      const date = new Date(value);
      return (
        <div className="text-sm leading-tight">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
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

  if (key === "relationship_status") {
    const statusColors: Record<string, string> = {
      single: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      married:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      divorced:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      widowed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      "in a relationship":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };

    const colorClass =
      statusColors[String(value).toLowerCase()] || "bg-gray-100 text-gray-800";

    return (
      <div className="flex justify-center">
        <Badge
          variant="secondary"
          className={`${colorClass} text-xs px-2 py-1`}
        >
          {String(value)}
        </Badge>
      </div>
    );
  }

  if (key === "age") {
    return <div className="font-medium text-sm">{String(value)} y/o</div>;
  }

  if (key === "profile_picture_url") {
    return (
      <div className="flex justify-center">
        {value ? (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium">IMG</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">—</span>
          </div>
        )}
      </div>
    );
  }

  const stringValue = String(value);

  if (stringValue.length > 20) {
    return (
      <div
        className="text-sm leading-tight break-words hyphens-auto"
        title={stringValue}
      >
        {stringValue}
      </div>
    );
  }

  return <div className="text-sm leading-tight">{stringValue}</div>;
}
