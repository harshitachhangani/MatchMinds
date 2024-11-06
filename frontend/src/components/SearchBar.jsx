import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div className="flex border-black rounded-2xl overflow-hidden">
      <input
        className="p-3 flex-grow border-0 outline-none	"
        type="text"
        placeholder="Search for your mate"
      />
      <div className="bg-white p-3 	">
        <FiSearch size={24} />
      </div>
    </div>
  );
};

export default SearchBar;
