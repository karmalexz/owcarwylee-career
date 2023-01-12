import React, { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const AOMultiDropdown = ({ placeholder, options, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const isSelected = (value) =>
    !!selectedOptions.find((op) => op.value === value);

  const selectOptions = (options, value) => {
    if (!isSelected(value)) {
      const option = options.find((op) => op.value === value);
      const newSelectedOptions = [
        ...selectedOptions,
        Object.assign({}, option),
      ];
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    } else {
      const newSelectedOptions = selectedOptions.filter(
        (op) => value !== op.value
      );
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    }
  };

  const isSubSelected = (value, subValue) => {
    return !!selectedOptions
      .find((op) => op.value === value)
      .subOptions.find((op) => op.value === subValue);
  };

  const selectSubOptions = (subOptions, value, subValue) => {
    if (!isSubSelected(value, subValue)) {
      const newSelectedOptions = [...selectedOptions];
      const option = newSelectedOptions.find((op) => op.value === value);
      if (!option.subOptions) option.subOptions = [];
      option.subOptions = [
        ...option.subOptions,
        subOptions.find((op) => op.value === subValue),
      ];
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    } else {
      let newSelectedOptions = [...selectedOptions];
      const option = newSelectedOptions.find((op) => op.value === value);
      option.subOptions = option.subOptions.filter(
        (op) => subValue !== op.value
      );
      if (!option.subOptions.length) {
        newSelectedOptions = newSelectedOptions.filter(
          (op) => value !== op.value
        );
      }
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    }
  };

  return (
    <div className="relative">
      <input
        className="w-full p-2 rounded-md placeholder-gray-400 text-gray-700 leading-tight focus:outline-none lg:placeholder:text-sm md:placeholder:text-base sm:placeholder:text-xs"
        id="search"
        type="text"
        value={
          selectedOptions.length > 0
            ? selectedOptions.map((op) => op.value).join(",")
            : ""
        }
        placeholder={placeholder}
        onClick={() => setOpen(!isOpen)}
        readOnly
      />
      <button
        type="button"
        className="hidden cursor-default relative rounded-sm border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="block truncate text-gray-500">
          {selectedOptions.length > 0
            ? selectedOptions.map((op) => op.value).join(",")
            : placeholder}
        </span>
        <span className="absolute p-2 items-center pointer-events-none">
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
          className="absolute w-full z-10 max-h-120 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          tabIndex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
        >
          {options.map(({ label, value, subOptions }) => (
            <div
              className="text-gray-900 relative cursor-default select-none"
              key={value}
            >
              <div
                className="flex items-center px-4 py-2 border-b border-gray-300  hover:bg-gray-200"
                onClick={() => selectOptions(options, value)}
              >
                <input type="checkbox" readOnly checked={isSelected(value)} />
                <span className="flex-1 mx-2 my-1 font-normal block truncate">
                  {label ?? value}
                </span>
                {isSelected(value) ? (
                  <AiFillCaretUp size={12} color="#D1D5DB" />
                ) : (
                  <AiFillCaretDown size={12} color="#D1D5DB" />
                )}
              </div>
              {isSelected(value) &&
                subOptions.map((subOption) => {
                  return (
                    <div
                      className="px-8 py-2 text-gray-900 relative cursor-default select-none hover:bg-gray-200"
                      key={subOption.value}
                    >
                      <div
                        className="flex items-center"
                        onClick={() =>
                          selectSubOptions(subOptions, value, subOption.value)
                        }
                      >
                        <input
                          type="checkbox"
                          readOnly
                          checked={isSubSelected(value, subOption.value)}
                        />
                        <span className="flex-1 px-2 py-1 font-normal block truncate">
                          {subOption.label ?? subOption.value}
                        </span>
                        <span className="font-normal block truncate">{`(${
                          subOption.count ?? 0
                        })`}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AOMultiDropdown;
