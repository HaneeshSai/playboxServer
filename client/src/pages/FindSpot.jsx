import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BoxCard from "../components/BoxCard";

export default function FindSpot() {
  const [boxes, setBoxes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce implementation
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const getBoxes = useCallback(
    debounce(async (searchQuery) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}box/findbox`,
          {
            query: searchQuery.length > 3 ? searchQuery : "Hyderabad",
          }
        );
        setBoxes(response?.data.boxes || []);
      } catch (error) {
        console.error("Error fetching boxes:", error);
        setBoxes([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    getBoxes(query);
  }, [query, getBoxes]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-20 py-10 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">Find Your Spot</h1>
      <div className="flex items-center gap-3 mt-5 border shadow-lg border-slate-600 bg-white rounded px-2 py-1 w-full max-w-sm justify-between">
        <input
          type="text"
          onChange={handleInputChange}
          className="bg-transparent w-full outline-none"
          placeholder="Enter Your Sport or Place"
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>
      <div className="w-full mt-6">
        <h1 className="text-lg sm:text-xl font-medium">
          Based on your {query.length > 3 ? "Query " : "Location "}
          <span className="text-green-800">
            {query.length > 3 ? query : "Hyderabad"}
          </span>
        </h1>
      </div>
      {loading ? (
        <div className="my-10 text-xl font-medium">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full my-10 gap-6 lg:gap-10">
          {boxes?.length > 0 ? (
            boxes.map((e, i) => <BoxCard key={i} e={e} />)
          ) : (
            <div className="text-center text-lg font-medium col-span-full">
              No spots found for your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

