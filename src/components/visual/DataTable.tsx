import React, { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Search, Table as TableIcon } from "lucide-react";

export interface ColumnDef<T = any> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T = any> {
  title?: string;
  description?: string;
  columns: ColumnDef<T>[];
  data: T[];
  pageSize?: number;
  searchPlaceholder?: string;
  enableExport?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  data,
  pageSize = 10,
  searchPlaceholder = "Filter records...",
  enableExport = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Search filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      return sortDir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${(title || "data_export").toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          {title && (
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <TableIcon className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-100">{title}</h3>
            </div>
          )}
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-7 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2.5" />
          </div>

          {enableExport && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-medium transition"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Table structure */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`py-3 px-3.5 select-none ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                  >
                    {col.sortable !== false ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white transition"
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-blue-400" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-400">{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-500">
                  No records match your query.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2.5 px-3.5 text-slate-200 ${
                        col.align === "right"
                          ? "text-right font-mono"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
        <span>
          Showing {paginatedData.length ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(page * pageSize, sortedData.length)} of {sortedData.length} records
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition"
            >
              Prev
            </button>
            <span className="px-2 text-slate-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
