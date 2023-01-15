import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

const AODropdown = ({ defaultValue, options, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultValue ?? options[0]
  );

  const selectOption = useCallback(
    (value) => {
      setSelectedOption(options.find((op) => op.value === value));
      if (onChange) onChange(value);
      setOpen(false);
    },
    [options, onChange]
  );

  useEffect(() => {
    if (defaultValue) selectOption(defaultValue.value);
  }, [defaultValue, selectOption]);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative cursor-pointer w-full rounded-sm border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="block truncate text-gray-500">
          {selectedOption.label ?? selectedOption.value}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div
          className="absolute w-full z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          tabIndex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          {options.map(({ label, value }) => (
            <div
              className="px-4 py-2 text-gray-900 relative cursor-default select-none hover:bg-gray-200"
              key={value}
              onClick={() => selectOption(value)}
            >
              <span className="flex-1 font-normal ml-3 block truncate">
                {label ?? value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AODropdown;
