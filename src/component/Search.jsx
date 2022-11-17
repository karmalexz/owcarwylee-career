import React from "react";
import { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { AiTwotoneCalendar } from "react-icons/ai";
import { BsCalendar2WeekFill } from "react-icons/bs";
import Example from "./WorkType";
import WorkType from "./WorkType";
import FooterComponent from "./FooterComponent";

const Search = () => {
  let lastItem = 10;
  const [jobs, setJobs] = useState([]);
  const [showMore, setShowMore] = useState(10);
  const [searchField, setSearchField] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, []);

  useEffect(() => {
    const newFilteredJobs = jobs.filter((job) => {
      return job.title.toString().toLocaleLowerCase().includes(searchField);
    });
    setFilteredJobs(newFilteredJobs);
  }, [jobs, searchField]);

  return (
    <div>
      <img className="w-64 p-6" src={require("../assets/logo2.png")} alt="" />
      <div className="">
        <img
          src={require("../assets/background.webp")}
          className="object-cover h-96 w-full"
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
         items-start ml-auto mr-auto"
      >
        <div>
          <h1 className="font-extrabold text-2xl">Job search</h1>
        </div>
        <div className="w-full max-w-screen-xl">
          <div className="justify-center py-10">
            <div className="w-full max-w-6xl">
              <div className="bg-white border rounded-sm rounded-b-none px-3 py-2 pb-3 flex flex-row">
                <div className="flex-auto border-r">
                  <div className="block tracking-widest text-gray-700 text-sm font-bold my-2 px-2 font-mukta uppercase">
                    What
                  </div>
                  <div className="items-center bg-gray-200 rounded-md">
                    <input
                      className="w-full rounded-md placeholder-gray-300 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                      id="search"
                      type="text"
                      placeholder="Enter keyword of role name"
                      onChange={(event) => {
                        const searchFieldString = event.target.value
                          .toString()
                          .toLocaleLowerCase();
                        setSearchField(searchFieldString);
                      }}
                    />
                  </div>
                </div>
                <div className="flex-auto ml-2">
                  <div className="block tracking-widest text-gray-700 text-sm font-bold py-2 px-2 font-mukta uppercase">
                    Category
                  </div>
                  <div className="items-center bg-gray-200 rounded-md">
                    <input
                      className="w-full rounded-md placeholder-gray-300 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                      id="search"
                      type="text"
                      placeholder="Enter keyword, role name or ID"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border border-t-0  rounded-sm rounded-t-none px-3 py-2 mb-4 pb-3">
                {/* <label
                  for="countries"
                  class="block mb-2 text-sm font-medium text-gray-900 bg-gray-400"
                ></label>
                <select
                  id="countries"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
                >
                  <option selected>All Work Types</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </select> */}
                <WorkType jobs={jobs} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*************************** Search Component End **************************/}

      <div>
        <div
          className="mx-8 mt-10 text-lg flex max-w-6xl justify-start
         items-start ml-auto mr-auto"
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
                <div className="border mx-8 mb-4 flex max-w-6xl justify-center items-center ml-auto mr-auto hover:border-black hover:bg-gray-50">
                  <div className="m-5  w-9/12 align-middle	">
                    <li className="p-5 font-bold text-xl">{job.title}</li>
                    {/* <p className="m-5 -mt-2 pb-14 w-10/12">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Delectus, est consectetur. Velit, error. Quasi itaque est
                    </p> */}
                  </div>
                  <div className="mr-auto text-xs mb-5 pr-10">
                    <div className="flex ml-auto mt-5 ">
                      <div className="mr-4 mt-0.5">
                        <HiLocationMarker />
                      </div>
                      <div className="text-gray-600 whitespace-nowrap">
                        <span className="mr-0.5">
                          {job.city ? job.city : job.country}{" "}
                        </span>
                        <span> {job.state} </span>
                        <span>{job.postalCode}</span>
                      </div>
                    </div>

                    <div className="flex ml-auto mt-5">
                      <div className="mr-4 mt-0.5">
                        <AiTwotoneCalendar />
                      </div>
                      <div className="text-gray-600 mr-5">
                        <span>
                          {job.jobType ? job.jobType : "Any Employment"}
                        </span>
                      </div>
                    </div>

                    <div className="flex ml-auto mt-5">
                      <div className="mr-4 mt-0.5">
                        <BsCalendar2WeekFill />
                      </div>
                      <div className="text-gray-600 mr-5">
                        <span>{job.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col mx-8 mb-4 max-w-6xl justify-center items-center ml-auto mr-auto">
        <button
          onClick={() => {
            lastItem = lastItem + 10;
            setShowMore(showMore + 10);
          }}
          className={`bg-transparent hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-4 w-full mb-6 border border-blue-500 hover:border-transparent rounded flex items-center justify-center ${
            showMore >= filteredJobs.length ? "cursor-not-allowed" : ""
          }`}
        >
          Show more jobs
        </button>
        <FooterComponent />
      </div>
    </div>
  );
};

export default Search;
