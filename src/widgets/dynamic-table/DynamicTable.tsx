import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type SortingState,
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
import { Button } from "@/shared/ui/components/Button/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/Dialog/dialog";
import { CreateUserForm } from "@/features/users-form/ui/CreateUserForm.tsx";
import { generateFormFieldConfigs } from "@/features/users-form/form-config.ts";
import type { FormFieldSchemaConfig } from "@/features/users-form/form-config.ts";
import { endpoint } from "@/shared/api/config.ts";

const PAGE_SIZE = 50;

export const DynamicTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  const { data, fetchNextPage, isFetching, isLoading, error, hasNextPage } =
    useInfiniteQuery({
      queryKey: [endpoint, sorting],
      queryFn: ({ pageParam = 0 }) =>
        fetchUsers(pageParam * PAGE_SIZE, PAGE_SIZE, sorting),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < PAGE_SIZE) return undefined;
        return allPages.length;
      },
    });

  const sampleUserData = useMemo(() => data?.pages[0]?.data[0], [data?.pages]);

  const columns = useMemo(() => {
    return generateColumns(sampleUserData);
  }, [sampleUserData]);

  const formFieldConfigs = useMemo((): FormFieldSchemaConfig[] => {
    return generateFormFieldConfigs(sampleUserData);
  }, [sampleUserData]);

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

  const handleFormSuccess = () => {
    setIsCreateUserDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Users Table</CardTitle>
        </div>
        <Dialog
          open={isCreateUserDialogOpen}
          onOpenChange={setIsCreateUserDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="default"
              disabled={!sampleUserData || formFieldConfigs.length === 0}
            >
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-fit">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            {sampleUserData && formFieldConfigs.length > 0 ? (
              <CreateUserForm
                fieldConfigs={formFieldConfigs}
                onFormSubmitSuccess={handleFormSuccess}
              />
            ) : (
              <p>Loading form configuration or no fields to display...</p>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && flatData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading initial data...</div>
          </div>
        ) : columns.length > 0 ? (
          <TableVirtualizer
            table={table}
            totalCount={totalCount}
            isFetching={isFetching}
            isLoading={isLoading && flatData.length === 0}
            hasNextPage={hasNextPage}
            fetchMore={fetchNextPage}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">
              No data to display or columns could not be generated.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
