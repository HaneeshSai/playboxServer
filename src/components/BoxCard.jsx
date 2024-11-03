import React from "react";

export default function BoxCard({ e }) {
  return (
    <div className="hover:scale-[1.05] duration-300 cardShadow h-96 rounded ">
      <img src={e.img} className="w-full h-[66%] rounded object-cover" alt="" />
      <div className="p-3">
        <div className=" flex items-center  justify-between">
          <p className="text-xl truncate flex-1 font-semibold">{e.placeName}</p>
          <p className="flex-[0.4]">
            {e.status === "o" ? (
              <span>
                <i className="fa-solid text-red-600 fa-circle-dot"></i> Occupied
              </span>
            ) : e.status === "f" ? (
              <span>
                <i className="fa-solid text-green-600 fa-circle-dot"></i>{" "}
                Available
              </span>
            ) : (
              <span>
                <i className="fa-solid text-yellow-400 fa-circle-dot"></i>{" "}
                Looking
              </span>
            )}
          </p>
        </div>
        <p className="text-lg">{e.areaName}</p>
        <p className="">
          Next Available Spot at{" "}
          <span className="font-semibold">{e.nextAvailableSpot}</span>
        </p>
        <div className="flex items-center justify-between">
          <p>
            Current Team size:{" "}
            <span
              className={`${
                e.currentTeamSize < e.requiredTeamSize
                  ? "text-red-600"
                  : "text-green-500"
              } font-semibold`}
            >
              {e.currentTeamSize}
            </span>
            /
            <span className="text-green-500 font-semibold">
              {e.requiredTeamSize}
            </span>
          </p>
          <button className="bg-[#269475] hover:bg-[#1b493c] duration-300 text-white px-3 py-0.5 rounded">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
