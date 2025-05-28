import { DynamicTable } from "@/widgets/dynamic-table/DynamicTable.tsx";

export default function App() {
  return (
    <div className="container mx-auto p-4 max-w-fit">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Users List</h2>
        <DynamicTable />
      </div>
    </div>
  );
}
