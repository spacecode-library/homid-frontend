import React, { useState, useMemo, useRef, useEffect } from "react";
import countryList from "react-select-country-list";
import { Search } from "lucide-react";

interface CountrySelectorRowProps {
  label: string;
  value: string;
  selectedCountry: string;
  isOpen: boolean;
  onValueChange: (value: string) => void;
  onSelectedCountryChange: (country: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export const CountrySelectorRow = ({
  label,
  value,
  selectedCountry,
  isOpen,
  onValueChange,
  onSelectedCountryChange,
  onOpenChange
}: CountrySelectorRowProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => countryList().getData(), []);

  // Filter countries based on search input
  const filteredCountries = useMemo(() => {
    if (!value) return options;
    return options.filter(country =>
      country.label.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
    onOpenChange(true);
  };

  const handleCountrySelect = (country: any) => {
    onSelectedCountryChange(country.label);
    onValueChange(country.label);
    onOpenChange(false);
  };

  const handleInputFocus = () => {
    onOpenChange(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onOpenChange]);

  return (
    <label className="flex items-center space-x-2 w-full">
      <input type="checkbox" className="w-4 h-4" />
      <span className="text-[16px] text-[#374151FF]">{label}</span>
      <div className="relative flex-1" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search"
          className="w-full text-sm px-2 py-1 pr-8 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.value}
                  onClick={() => handleCountrySelect(country)}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100 last:border-b-0"
                >
                  {country.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No countries found
              </div>
            )}
          </div>
        )}
      </div>
    </label>
  );
};