import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search experiences, topics, problems...',
  onSubmit,
  autoFocus = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="search-bar-wrapper">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};
