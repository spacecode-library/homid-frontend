import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type DropdownField = "ageGroup" | "gender" | "religiousGroup" | "incomeLevel";

interface Selections {
  ageGroup: string;
  gender: string;
  religiousGroup: string;
  incomeLevel: string;
}

interface TargetedAudienceProps {
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
}

interface DropdownOptions {
  ageGroup: string[];
  gender: string[];
  religiousGroup: string[];
  incomeLevel: string[];
}

interface DropdownFieldProps {
  label: string;
  field: DropdownField;
  value: string;
  onSelect: (field: DropdownField, value: string) => void;
}

export const TargetedAudience: React.FC<TargetedAudienceProps> = ({
  selections,
  setSelections,
}) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownField | null>(null);

  const dropdownOptions: DropdownOptions = {
    ageGroup: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+", "All Ages"],
    gender: ["Male", "Female", "Non-binary", "All Genders"],
    religiousGroup: [
      "Christian",
      "Muslim",
      "Jewish",
      "Hindu",
      "Buddhist",
      "Other",
      "Non-religious",
      "All Religious Groups",
    ],
    incomeLevel: [
      "Under $25k",
      "$25k-$50k",
      "$50k-$75k",
      "$75k-$100k",
      "$100k-$150k",
      "$150k+",
      "All Income Levels",
    ],
  };

  const handleSelection = (field: DropdownField, value: string): void => {
    setSelections((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (field: DropdownField): void => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    field,
    value,
    onSelect,
  }) => (
    <div className="flex items-center gap-x-4 mb-2">
      <label className="text-[16px] text-[#374151FF] font-normal w-full max-w-28 whitespace-nowrap">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => toggleDropdown(field)}
          className="flex items-center justify-between min-w-[120px] px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <span className={value === "Dropdown" ? "text-gray-500" : "text-gray-900"}>
            {value}
          </span>
          <ChevronDown
            size={16}
            className={`ml-2 transition-transform ${openDropdown === field ? "rotate-180" : ""
              }`}
          />
        </button>

        {openDropdown === field && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[180px] bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
            {dropdownOptions[field].map((option, index) => (
              <button
                key={index}
                onClick={() => onSelect(field, option)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-[16px] font-normal text-[#374151FF]">
        Who's Targeted audience?
      </p>

      <div className="mt-[6px]">
        <div className="grid grid-cols-1 gap-1">
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="flex-1">
              <DropdownField
                label="Age Group:"
                field="ageGroup"
                value={selections.ageGroup}
                onSelect={handleSelection}
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Gender:"
                field="gender"
                value={selections.gender}
                onSelect={handleSelection}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="flex-1">
              <DropdownField
                label="Religious Group:"
                field="religiousGroup"
                value={selections.religiousGroup}
                onSelect={handleSelection}
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Income Level:"
                field="incomeLevel"
                value={selections.incomeLevel}
                onSelect={handleSelection}
              />
            </div>
          </div>
        </div>
      </div>

      {openDropdown && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
};
