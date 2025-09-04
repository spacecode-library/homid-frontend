import React, { useState } from 'react';

interface SocialMediaItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  customValue?: string;
}

interface SocialMediaSelectorProps {
  value: SocialMediaItem[];
  onChange: (socialMedia: SocialMediaItem[]) => void;
}

export const SocialMediaSelector: React.FC<SocialMediaSelectorProps> = ({
  value,
  onChange
}) => {
  const handleCheckboxChange = (id: string) => {
    const updatedItems = value.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onChange(updatedItems);
  };

  const handleCustomValueChange = (id: string, customValue: string) => {
    const updatedItems = value.map(item =>
      item.id === id ? { ...item, customValue } : item
    );
    onChange(updatedItems);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {value.map((item) => {
        if (item.id === 'other') {
          return (
            <label key={item.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={item.checked}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
              <input
                type="text"
                placeholder="Enter"
                value={item.customValue || ''}
                onChange={(e) => handleCustomValueChange(item.id, e.target.value)}
                className="w-24 rounded-md border border-gray-300 p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!item.checked}
              />
            </label>
          );
        }

        return (
          <label key={item.id} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={item.checked}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <img src={item.icon} className="w-[22px] h-[22px]" alt={item.name} />
          </label>
        );
      })}
    </div>
  );
};
