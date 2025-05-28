import { DynamicTable } from "@/widgets/dynamic-table/DynamicTable.tsx";

export default function App() {
  return (
    <div className="container mx-auto p-4 max-w-max">
      <h1 className="text-2xl font-bold mb-4">Dynamic Table</h1>
      <DynamicTable />
    </div>
  );
}
