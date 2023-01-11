import AODropdown from "../../components/AODropdown";

const radiusOptions = [
  {
    label: "Exact location",
    value: 0,
  },
  {
    label: "+5km",
    value: 5,
  },
  {
    label: "+10km",
    value: 10,
  },
  {
    label: "+20km",
    value: 20,
  },
  {
    label: "+30km",
    value: 30,
  },
  {
    label: "+50km",
    value: 50,
  },
];

const RadiusFilter = ({ onChange }) => {
  return (
    <div className="relative w-full">
      <AODropdown
        options={radiusOptions}
        defaultValue={radiusOptions[5]}
        onChange={onChange}
      />
    </div>
  );
};

export default RadiusFilter;
