import { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { MdClear } from "react-icons/md";
import { Combobox } from "@headlessui/react";
import { getMapServices } from "../../utils/map";

const PlaceFilter = ({ placeholder, defaultValue = "", onChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({});

  const selectPlace = async (value) => {
    const { placeService } = await getMapServices();
    if (placeService) {
      placeService.getDetails(
        {
          placeId: value.place_id,
          language: "en",
          fields: [
            "place_id",
            "address_components",
            "formatted_address",
            "geometry",
          ],
        },
        (result, status) => {
          console.log("PlaceFilter", status, result);
          const place = {
            description: value.description,
            latlng: {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
            },
          };
          result.address_components.forEach((item) => {
            if (item.types.includes("locality")) {
              place.city = item.short_name;
            } else if (item.types.includes("administrative_area_level_1")) {
              place.state = item.short_name;
            }
            if (item.types.includes("postal_code")) {
              place.postalCode = item.short_name;
            } else if (item.types.includes("country")) {
              place.country = item.short_name;
            }
          });
          console.log("PlaceFilter", place);
          setSelectedPlace(place);
          if (onChange) onChange(place);
        }
      );
    }
  };

  const search = async (value) => {
    const { autocompleteService } = await getMapServices();
    if (value && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: value,
          language: "en",
          types: ["(regions)"],
          componentRestrictions: { country: ["au", "ca", "nz"] },
        },
        (predictions, status) => {
          if (predictions && predictions.length) {
            console.log(status, predictions);
            setPlaces(predictions);
          } else {
            setPlaces([]);
          }
        }
      );
    } else {
      setPlaces([]);
      setSelectedPlace({});
      if (onChange) onChange({});
    }
  };

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedPlace.description ?? defaultValue}
        onChange={(value) => selectPlace(value)}
      >
        <div className="realative">
          <Combobox.Input
            className="relative w-full px-10 py-2 rounded-sm border border-gray-300 bg-white text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            placeholder={placeholder}
            onClick={() => setOpen(!isOpen)}
            onChange={(event) => search(event.target.value)}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              className="p-1 focus:outline-none focus:shadow-outline"
            >
              <HiLocationMarker color="#D1D5DB" />
            </button>
          </span>
          {(selectedPlace.description || defaultValue) && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="submit"
                className="p-1 focus:outline-none focus:shadow-outline"
                onClick={() => search(null)}
              >
                <MdClear color="#D1D5DB" />
              </button>
            </span>
          )}
        </div>
        {places.length > 0 && (
          <div>
            <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {places.map((place) => (
                <Combobox.Option
                  className="px-4 py-2 text-gray-900 relative cursor-default select-none hover:bg-gray-200"
                  key={place.place_id}
                  value={place}
                >
                  {place.description}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default PlaceFilter;
