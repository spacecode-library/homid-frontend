import React, { useState, useRef, useEffect } from 'react';

interface SocialMediaItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  customValue?: string;
  socialLink?: string;
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

  const handleSocialLinkChange = (id: string, socialLink: string) => {
    const updatedItems = value.map(item =>
      item.id === id ? { ...item, socialLink } : item
    );
    onChange(updatedItems);
  };

  const handleIconClick = (id: string) => {
    // Toggle the checkbox when icon is clicked
    handleCheckboxChange(id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Social Media Icons Row */}
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
              <img
                src={item.icon}
                className="w-[22px] h-[22px] cursor-pointer hover:opacity-80 transition-opacity"
                alt={item.name}
                onClick={() => handleIconClick(item.id)}
              />
            </label>
          );
        })}
      </div>

      {/* Input Fields Below - Only show for checked items */}
      <div className="flex flex-col gap-2">
        {value
          .filter(item => item.checked)
          .map((item) => {
            if (item.id === 'other') {
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <label className="w-20 text-sm text-gray-700 font-medium">
                    {item.name}:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom platform name"
                    value={item.customValue || ''}
                    onChange={(e) => handleCustomValueChange(item.id, e.target.value)}
                    className="flex-1 max-w-md px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              );
            }

            return (
              <div key={item.id} className="flex items-center gap-2">
                <label className="w-20 text-sm text-gray-700 font-medium">
                  {item.name}:
                </label>
                <input
                  type="url"
                  placeholder={`Enter your ${item.name} link`}
                  value={item.socialLink || ''}
                  onChange={(e) => handleSocialLinkChange(item.id, e.target.value)}
                  className="flex-1 max-w-md px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};