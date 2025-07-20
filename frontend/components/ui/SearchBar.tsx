import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
  filterActive?: boolean;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search clips...",
  value,
  onChange,
  onClear,
  showFilter = false,
  onFilterClick,
  filterActive = false,
  className,
  autoFocus = false
}) => {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={clsx(
      'relative flex items-center bg-dark-100 border border-dark-200',
      'rounded-lg focus-within:border-gaming-400 focus-within:ring-1',
      'focus-within:ring-gaming-400 transition-colors',
      className
    )}>
      {/* Search Icon */}
      <div className="absolute left-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-dark-400" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={clsx(
          'w-full pl-10 pr-4 py-2.5 bg-transparent text-white',
          'placeholder-dark-400 focus:outline-none',
          showFilter ? 'pr-20' : value ? 'pr-10' : 'pr-4'
        )}
      />

      {/* Clear Button */}
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="absolute right-3 p-1 text-dark-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      {/* Filter Button */}
      {showFilter && (
        <motion.button
          onClick={onFilterClick}
          className={clsx(
            'absolute right-3 p-2 rounded-md transition-colors',
            filterActive
              ? 'text-gaming-400 bg-gaming-400/10'
              : 'text-dark-400 hover:text-white hover:bg-dark-200'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open filters"
        >
          <Filter className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;
