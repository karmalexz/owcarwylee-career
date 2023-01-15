import { useState } from "react";
import { useEffect } from "react";
import AOSelect from "../../components/AOSelect";

const options = [
  {
    label: "Any Employment",
    value: "AnyEmployment",
  },
  {
    value: "Casual",
  },
  {
    value: "Contract",
  },
  {
    label: "Full Time Permanent",
    value: "Full Time - Permanent",
  },
  {
    label: "Part Time Permanent",
    value: "Part Time - Permanent",
  },
];

const WorkTypeFilter = ({ jobs, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    jobs.forEach((j) => {
      let jobType = j.jobType ?? "AnyEmployment";
      let jobTypeOption = options.find((o) => o.value === jobType);
      if (jobTypeOption) {
        if (jobTypeOption.count) {
          jobTypeOption.count += 1;
        } else {
          jobTypeOption.count = 1;
        }
      }
    });
    console.log("WorkTypeFilter", options);
  }, [jobs]);

  return (
    <AOSelect
      placeholder="All Work Types"
      value={
        selectedOptions.length > 2
          ? `${selectedOptions.length} Work Types`
          : null
      }
      options={options}
      onChange={(value) => {
        setSelectedOptions(value);
        if (onChange) onChange(value);
      }}
    />
  );
};

export default WorkTypeFilter;
