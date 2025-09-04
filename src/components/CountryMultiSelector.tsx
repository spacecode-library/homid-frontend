import React, { useState, useMemo, useRef, useEffect } from "react";
import countryList from "react-select-country-list";
import { Search, ChevronDown, X } from "lucide-react";

interface CountryMultiSelectorProps {
  selected: string[];
  onSelectionChange: (countries: string[]) => void;
  maxSelections?: number;
}

export const CountryMultiSelector = ({
  selected,
  onSelectionChange,
  maxSelections = 20
}: CountryMultiSelectorProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => countryList().getData(), []);

  // Filter countries based on search input and exclude already selected
  const filteredCountries = useMemo(() => {
    const availableCountries = options.filter(country =>
      !selected.includes(country.label)
    );

    if (!searchValue) return availableCountries;

    return availableCountries.filter(country =>
      country.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, options, selected]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSearchFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCountrySelect = (countryLabel: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling

    if (selected.length >= maxSelections) {
      alert(`You can select maximum ${maxSelections} countries`);
      return;
    }

    const newSelected = [...selected, countryLabel];
    onSelectionChange(newSelected);
    setSearchValue("");
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleRemoveCountry = (countryToRemove: string) => {
    const newSelected = selected.filter(country => country !== countryToRemove);
    onSelectionChange(newSelected);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <p className="text-[14px] font-normal text-[#374151] mb-2">
        Block Visitors by Country (or City, State, Province)
      </p>

      {/* Container for search and dropdown button with proper positioning */}
      <div className="relative" ref={dropdownRef}>
        {/* Top controls (search + dropdown button) - Keep in row */}
        <div className="flex items-center space-x-2 mb-2">
          {/* Search box with icon */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder={`Select Max ${maxSelections} (${selected.length}/${maxSelections} selected)`}
              className="w-full border border-gray-300 rounded-md text-sm pl-8 pr-2 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={selected.length >= maxSelections}
            />
          </div>

          {/* Dropdown button */}
          <button
            onClick={handleDropdownToggle}
            className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Countries
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown - Positioned absolutely to not affect layout */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.value}
                  onClick={(event) => handleCountrySelect(country.label, event)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                >
                  <span>{country.label}</span>
                  {selected.length >= maxSelections && (
                    <span className="text-xs text-gray-400">Max reached</span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {selected.length >= maxSelections ?
                  `Maximum ${maxSelections} countries selected` :
                  'No countries found'
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 min-h-[44px]">
        {selected.length === 0 ? (
          <span className="text-gray-400 text-sm">No countries selected</span>
        ) : (
          selected.map((tag) => (
            <span
              key={tag}
              className="flex items-center space-x-1 bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md border border-blue-200"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveCountry(tag)}
                className="focus:outline-none hover:bg-blue-100 rounded"
              >
                <X className="w-3 h-3 text-blue-500" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Selection counter */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>{selected.length} of {maxSelections} countries selected</span>
        {selected.length > 0 && (
          <button
            onClick={() => onSelectionChange([])}
            className="text-red-500 hover:text-red-700"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};