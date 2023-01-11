const SearchFooter = () => {
  return (
    <div className="mx-8 mb-4 max-w-6xl justify-center w-full items-center ml-auto mr-auto p-10 bg-gray-100 flex flex-row lg:max-w-4xl md:max-w-2xl md:flex-col">
      <div>
        <p className="text-xl font-bold mb-4 md:text-lg md:whitespace-nowrap md:text-center">
          We're always on the lookout for talent
        </p>
        <p className="w-11/12 md:text-center">
          If you are thinking about a future with us, sign up to stay connnected
          and be informed of any new opportunities.
        </p>
      </div>
      <div>
        <div className="whitespace-nowrap font-bold text-sm rounded-md bg-black text-white p-2 px-12 hover:bg-gray-700 hover:cursor-pointer transition ease-in-out duration-500 md:text-xs md:mt-5">
          <a href="https://www.livehire.com/talent/community/oscarwylee/careers/contact">
            Join our Talent Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchFooter;
