import { useState } from "react";

const AOSelect = ({ placeholder, value, options, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const isSelected = (value) =>
    !!selectedOptions.find((op) => op.value === value);

  const selectOptions = (value) => {
    if (isSelected(value)) {
      const newSelectedOptions = selectedOptions.filter(
        (o) => o.value !== value
      );
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    } else {
      const newSelectedOptions = [
        ...selectedOptions,
        options.find((o) => o.value === value),
      ];
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    }
    setOpen(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full rounded-sm border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="block truncate text-gray-500">
          {value
            ? value
            : selectedOptions.length > 0
            ? selectedOptions.map((o) => o.label ?? o.value).join(",")
            : placeholder}
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
          className="absolute w-full mt-1 z-10 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          tabIndex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          {options.map(({ label, value, count }) => (
            <div
              className="px-4 py-2 text-gray-900 relative cursor-default select-none hover:bg-gray-200"
              key={value}
            >
              <div
                className="flex items-center"
                onClick={() => selectOptions(value)}
              >
                <input type="checkbox" readOnly checked={isSelected(value)} />
                <span className="px-4 flex-1 font-normal block truncate">
                  {label ?? value}
                </span>
                {count && (
                  <span className="font-normal block truncate">{`(${count})`}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AOSelect;
