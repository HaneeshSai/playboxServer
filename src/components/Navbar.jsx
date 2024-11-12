import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className=" sticky z-20 top-0">
      <div className=" flex backdrop-blur-3xl shadow-lg items-center  w-full justify-between px-10 py-5">
        <div>
          <h1 className="text-3xl font-semibold text-[#FF6B35]">PlayBoxx</h1>
        </div>
        <div className="flex gap-2 items-center">
          <div className="border bg-white shadow-xl flex justify-between gap-2 items-center border-slate-800 rounded px-1 py-0.5 ">
            <i className="fa-solid ml-1 fa-magnifying-glass"></i>
            <input
              className="outline-none bg-[#fff0]"
              type="text"
              placeholder="Search Your Location"
            />
          </div>
          <button className="bg-[#FF6B35] text-white px-2 py-0.5 rounded font-medium">
            Search
          </button>
        </div>
        <div className=" w-[45%] flex items-center justify-between text font-medium">
          <Link to="/" className="bg-[#269475] px-2 rounded py-0.5 text-white">
            Book a spot
          </Link>
          <Link to={"/"}>Find your sport</Link>
          <Link to={"/"}>About</Link>
          <Link to={"/"}>Join Us</Link>
          <Link to={"/"}>Contact</Link>
        </div>
      </div>
    </div>
  );
}
