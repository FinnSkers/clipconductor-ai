import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  selectedRows?: Set<number>;
  onRowSelect?: (index: number, selected: boolean) => void;
  selectAll?: boolean;
  onSelectAll?: (selected: boolean) => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  selectedRows,
  onRowSelect,
  selectAll = false,
  onSelectAll,
  className
}: DataTableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const handleRowSelect = (index: number) => {
    const isSelected = selectedRows?.has(index) || false;
    onRowSelect?.(index, !isSelected);
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    onSelectAll?.(newSelectAll);
  };

  if (loading) {
    return (
      <div className={clsx("bg-dark-100 rounded-lg border border-dark-200", className)}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-400 mx-auto"></div>
          <p className="text-dark-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("bg-dark-100 rounded-lg border border-dark-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-200 border-b border-dark-300">
            <tr>
              {onRowSelect && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    className="rounded border-dark-300 bg-dark-200 text-gaming-400 focus:ring-gaming-400"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={clsx(
                    "px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:text-white transition-colors",
                    column.width && `w-${column.width}`
                  )}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sortColumn === column.key && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gaming-400"
                      >
                        {sortDirection === 'asc' ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </motion.div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (onRowSelect ? 1 : 0)} 
                  className="px-6 py-12 text-center text-dark-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={clsx(
                    "hover:bg-dark-50 transition-colors",
                    onRowClick && "cursor-pointer",
                    selectedRows?.has(index) && "bg-gaming-400/10"
                  )}
                  onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                >
                  {onRowSelect && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows?.has(index) || false}
                        onChange={() => handleRowSelect(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-dark-300 bg-dark-200 text-gaming-400 focus:ring-gaming-400"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td 
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-white"
                    >
                      {column.render 
                        ? column.render(item[column.key], item, index)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
