import { useEffect } from "react";
import AOMultiDropdown from "../../components/AOMultiDropdown";

const options = [
  {
    value: "Head Office",
    subOptions: [
      {
        value: "Finance",
      },
      {
        value: "Marketing",
      },
      {
        value: "People",
      },
      {
        value: "Product",
      },
      {
        value: "Technology",
      },
      {
        value: "Other",
      },
    ],
  },
  {
    value: "Optometrist",
    subOptions: [
      {
        value: "Locum",
      },
      {
        value: "Optical",
      },
      {
        value: "Other",
      },
    ],
  },
  {
    value: "Partnership",
    subOptions: [
      {
        value: "Retail",
      },
    ],
  },
  {
    value: "Retail",
    subOptions: [
      {
        value: "Area Management",
      },
      {
        value: "Optical",
      },
      {
        value: "Store Management",
      },
      {
        value: "Other",
      },
    ],
  },
];

const CategoryFilter = ({ jobs, onChange }) => {
  useEffect(() => {
    jobs.forEach((j) => {
      let categoryOption = options.find((o) => o.value === j.category);
      if (categoryOption) {
        const subcategory = j.subcategory ?? "Other";
        const subCategoryOption = categoryOption.subOptions.find(
          (so) => so.value === subcategory
        );
        if (subCategoryOption) {
          if (subCategoryOption.count) {
            subCategoryOption.count += 1;
          } else {
            subCategoryOption.count = 1;
          }
        }
      }
    });
    console.log("CategoryFilter", options);
  }, [jobs]);

  return (
    <AOMultiDropdown
      placeholder={"Search Head Office, Optometrist, Partnership or Retail"}
      options={options}
      onChange={onChange}
    />
  );
};

export default CategoryFilter;
