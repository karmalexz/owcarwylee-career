import { useState, useEffect } from "react";

import { HiLocationMarker } from "react-icons/hi";
import { AiTwotoneCalendar } from "react-icons/ai";
import { BsCalendar2WeekFill } from "react-icons/bs";

import { getMapServices } from "../../utils/map";
import { ago, distance } from "../../utils/utils";

import PlaceFilter from "./PlaceFilter";
import RadiusFilter from "./RadiusFilter";

import WorkTypeFilter from "./WorkTypeFilter";
import CategoryFilter from "./CategoryFilter";

import SearchFooter from "./SearchFooter";
import { countryNames } from "../../utils/constants";

const placeKVs = require("../../assets/places.json");

const savePlace = async (services, { referenceNumber, city, country }) => {
  const { autocompleteService, placeService } = services;
  const place = placeKVs.find((kv) => kv.key === referenceNumber);
  if (place) return Promise.resolve(place.value);

  const placeString = localStorage.getItem(referenceNumber);
  if (placeString) return Promise.resolve(JSON.parse(placeString));

  return new Promise((resolve) => {
    if (placeString) {
      const place = JSON.parse(placeString);
      console.log("SearchPage", place);
      resolve(place);
    } else {
      autocompleteService.getPlacePredictions(
        {
          input: city,
          language: "en",
          types: ["(cities)"],
          componentRestrictions: { country: country },
        },
        (predictions, status) => {
          console.log("SearchPage", status, predictions);
          if (predictions && predictions.length) {
            const placeId = predictions[0].place_id;
            placeService.getDetails(
              {
                placeId: placeId,
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
                  description: result.formatted_address,
                  country: country,
                  latlng: {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                  },
                };
                result.address_components.forEach((item) => {
                  if (item.types.includes("locality")) {
                    place.city = item.short_name;
                  } else if (
                    item.types.includes("administrative_area_level_1")
                  ) {
                    place.state = item.short_name;
                  }
                  if (item.types.includes("postal_code")) {
                    place.postalCode = item.short_name;
                  }
                });
                console.log("PlaceFilter", place);
                localStorage.setItem(referenceNumber, JSON.stringify(place));
                resolve(place);
              }
            );
          } else {
            resolve({});
          }
        }
      );
    }
  });
};

const SearchPage = () => {
  let endpoint = "";
  if (window.location.href.includes("=")) {
    endpoint = window.location.href.split("=")[1];
  }

  const [country, setCountry] = useState(endpoint);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(
      "https://prod-publicjobfeed.livehire.com/oscarwylee/LiveHirePublicXmlFeed.xml"
    )
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(async (data) => {
        let jobDom = data.getElementsByTagName("job");
        let newJobs = [];
        for (let i = 0; i < jobDom.length; i++) {
          let obj = {};
          for (let j = 0; j < jobDom[i].childNodes.length; j++) {
            obj[jobDom[i].childNodes[j].tagName] =
              jobDom[i].childNodes[j].innerHTML;
          }
          newJobs.push(obj);
        }
        setJobs(newJobs);
        console.log("jobs", newJobs);

        const services = await getMapServices();
        newJobs.forEach(async (job) => {
          job.place = await savePlace(services, job);
        });
      });
  }, []);

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const [placeFilter, setPlaceFilter] = useState({});
  const [radiusFilter, setRadiusFilter] = useState(0);

  const [whatFilter, setWhatFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    let newJobs = jobs;

    if (country) {
      newJobs = newJobs.filter((job) => {
        return job.country === country;
      });
    }

    if (placeFilter && placeFilter.description) {
      newJobs = newJobs.filter((job) => {
        let flag = false;
        if (placeFilter.postalCode) {
          flag = placeFilter.postalCode === job.postalCode;
        } else if (placeFilter.city) {
          flag = placeFilter.city === job.city;
        } else if (placeFilter.state) {
          flag = placeFilter.state === job.state;
        } else if (placeFilter.country) {
          flag = placeFilter.country === job.country;
        }

        if (flag) return true;

        if (job.place && job.place.latlng && radiusFilter) {
          flag = distance(job.place.latlng, placeFilter.latlng) <= radiusFilter;
        }
        return flag;
      });
    }

    if (whatFilter && whatFilter.length) {
      newJobs = newJobs.filter((item) =>
        item.title.toLocaleLowerCase().includes(whatFilter.toLocaleLowerCase())
      );
    }

    if (workTypeFilter && workTypeFilter.length) {
      newJobs = newJobs.filter((job) => {
        const jobType = job.jobType ?? "AnyEmployment";
        return workTypeFilter.find((item) => {
          return item.value === jobType;
        });
      });
    }

    if (categoryFilter && categoryFilter.length) {
      newJobs = newJobs.filter((job) => {
        return categoryFilter.find((item) => {
          const subcategory = job.subcategory ?? "Other";
          return (
            job.category &&
            item.value.includes(job.category) &&
            item.subOptions.map((op) => op.value).includes(subcategory)
          );
        });
      });
    }

    newJobs = newJobs.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredJobs(newJobs);
    console.log("filteredJobs", newJobs);
  }, [
    country,
    jobs,
    placeFilter,
    radiusFilter,
    whatFilter,
    workTypeFilter,
    categoryFilter,
  ]);

  const [showMore, setShowMore] = useState(10);
  const [buttonText, setButtonText] = useState("Show More Jobs");
  const changeText = (text) => setButtonText(text);

  return (
    <div>
      <a
        {...(endpoint === "AU"
          ? { href: "https://www.oscarwylee.com.au" }
          : endpoint === "NZ"
          ? { href: "https://www.oscarwylee.co.nz" }
          : endpoint === "CA"
          ? { href: "https://oscarwylee.ca" }
          : { href: "https://www.oscarwylee.com.au" })}
      >
        <img
          className="w-64 p-6"
          src={require("../../assets/logo2x.png")}
          alt=""
        />
      </a>
      <div className="">
        <img
          src={
            endpoint === "CA"
              ? require("../../assets/ca_banner.webp")
              : endpoint === "AU"
              ? require("../../assets/au_banner.webp")
              : endpoint === "NZ"
              ? require("../../assets/nz_banner.webp")
              : require("../../assets/au_banner.webp")
          }
          className="object-cover h-96 w-full lg:h-60 md:h-48"
          alt=""
        />
      </div>
      <div className="mt-20 text-center">
        <h1 className="text-2xl font-extrabold">
          We believe everyone deserves to live the career they love.
        </h1>
        <h2 className="text-2xl mt-3 font-medium text-gray-600">
          Make our vision your reality, let's talk!
        </h2>
      </div>

      {/*************************** Search Component Start **************************/}
      <div
        className="mx-8 mt-10 text-lg flex-col max-w-6xl justify-start
         items-start ml-auto mr-auto lg:max-w-4xl"
      >
        <div>
          <h1 className="font-extrabold text-2xl ml-5">Job search</h1>
        </div>
        <div className="w-full max-w-screen-xl">
          <div className="justify-center py-10">
            <div className="w-full max-w-6xl lg:max-w-4xl lg:mx-auto">
              <div className="bg-white border rounded-sm rounded-b-none px-3 py-2 pb-3 flex flex-row md:flex-col md:rounded-none">
                <div className="flex-auto border-r md:border-r-0">
                  <div className="block tracking-widest text-gray-700 text-sm font-bold my-2 px-2 font-mukta uppercase">
                    What
                  </div>
                  <div className="items-center bg-gray-200 rounded-md">
                    <input
                      value={whatFilter}
                      className="w-full rounded-md placeholder-gray-400 text-gray-700 leading-tight focus:outline-none py-2 px-2 sm:placeholder:text-xs lg:placeholder:text-sm md:placeholder:text-base"
                      id="search"
                      type="text"
                      placeholder="Enter keyword of role name"
                      onChange={(event) => setWhatFilter(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-auto md:border-r-0">
                  <div className="block tracking-widest text-gray-700 text-sm font-bold my-2 px-5 font-mukta uppercase">
                    Category
                  </div>
                  <div className="items-center bg-white rounded-md">
                    <CategoryFilter jobs={jobs} onChange={setCategoryFilter} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col p-2 bg-gray-100">
                <div className="flex-1">
                  <WorkTypeFilter jobs={jobs} onChange={setWorkTypeFilter} />
                </div>
                <div className="w-4 md:h-2"></div>
                <div className="flex-1 flex flex-row md:flex-col">
                  <div className="flex-1">
                    <PlaceFilter
                      placeholder="Search Postal code, City, State"
                      // defaultValue={countryNames[country]}
                      onChange={(value) => {
                        setPlaceFilter(value);
                        if (value !== endpoint) setCountry("");
                        if (!value.description) setRadiusFilter(0);
                      }}
                    />
                  </div>
                  <div className="w-4 md:h-2"></div>
                  {placeFilter.city && (
                    <div className="w-48 md:w-full">
                      <RadiusFilter onChange={setRadiusFilter} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*************************** Search Component End **************************/}

      <div>
        <div
          className="mx-8 mt-10 text-lg flex max-w-6xl justify-start
         items-start ml-auto mr-auto lg:max-w-4xl lg:px-2 md:max-w-2xl md:px-1"
        >
          <p>
            Showing{" "}
            <span className="font-bold">
              {showMore > filteredJobs.length ? filteredJobs.length : showMore}
            </span>{" "}
            of {filteredJobs.length}
          </p>
        </div>

        <ul className="mt-8">
          {filteredJobs.slice(0, showMore).map((job) => {
            return (
              <a href={job.url} key={job.referenceNumber}>
                <div className="md:px-1 lg:px-2">
                  <div className="border mx-8 mb-4 flex max-w-6xl justify-center items-center ml-auto mr-auto hover:border-black hover:bg-gray-50 lg:max-w-4xl md:max-w-2xl">
                    <div className="m-5  w-9/12 align-middld md:mx-0">
                      <li className="p-5 font-bold text-xl lg:text-base md:text-sm">
                        {job.title}
                      </li>
                    </div>
                    <div className="mr-auto text-xs mb-5 pr-10 whitespace-nowrap lg:w-44 lg:mr-10 md:w-40">
                      <div className="flex ml-auto mt-5 w-52 lg:mt-4 md:w-40  ">
                        <div className="mr-4 mt-0.5">
                          <HiLocationMarker />
                        </div>
                        <div className="text-gray-600 whitespace-normal">
                          <span className="mr-0.5 md:whitespace-normal">
                            {job.city ? job.city : job.country}{" "}
                          </span>
                          <span> {job.state} </span>
                          <span>{job.postalCode}</span>
                        </div>
                      </div>

                      <div className="flex ml-auto mt-5 lg:mt-4 lg:text-right">
                        <div className="mr-4 mt-0.5">
                          <AiTwotoneCalendar />
                        </div>
                        <div className="text-gray-600 mr-5">
                          <span>
                            {job.jobType ? job.jobType : "Any Employment"}
                          </span>
                        </div>
                      </div>

                      <div className="flex ml-auto mt-5  lg:mt-4">
                        <div className="mr-4 mt-0.5">
                          <BsCalendar2WeekFill />
                        </div>
                        <div className="text-gray-600 mr-5">
                          <span>{ago(job.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col mx-8 mb-4 max-w-6xl justify-center items-center ml-auto mr-auto lg:px-2">
        <button
          onClick={() => setShowMore(showMore + 10)}
          className={`
            bg-transparent hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-4 w-full mb-6 border border-blue-500 hover:border-transparent rounded flex items-center justify-center lg:max-w-4xl md:max-w-2xl md:w-full md:mx-1 
            ${showMore >= filteredJobs.length ? "cursor-not-allowed" : ""}
            ${
              showMore >= filteredJobs.length
                ? "md:bg-blue-300 md:hover:bg-blue-300 "
                : ""
            }
          `}
        >
          Show More Jobs
        </button>
        <SearchFooter />
      </div>
    </div>
  );
};

export default SearchPage;
