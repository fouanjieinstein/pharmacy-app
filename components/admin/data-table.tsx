import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="scrollbar-thin overflow-x-auto rounded-md border border-brand-gray-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-gray-200 bg-brand-gray-50">
            {columns.map((col) => (
              <th key={col.header} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-brand-gray-50">
              {columns.map((col) => (
                <td key={col.header} className={col.className ?? "px-4 py-3.5 text-brand-navy-900"}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-8 text-center text-sm text-brand-gray-500">No records found.</p>}
    </div>
  );
}
