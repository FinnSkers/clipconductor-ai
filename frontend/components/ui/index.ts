// UI Component Library Export
// Centralized exports for reusable UI components

// Core UI Components
export { default as Button } from './Button';
export { default as Modal } from './Modal';
export { default as SearchBar } from './SearchBar';
export { default as DataTable } from './DataTable';
export { default as FileUpload } from './FileUpload';
export { default as ProgressBar } from './ProgressBar';

// Type exports
export type { Column, DataTableProps } from './DataTable';

// Re-export commonly used types for convenience
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ProgressVariant = 'default' | 'gaming' | 'success' | 'warning' | 'danger';
