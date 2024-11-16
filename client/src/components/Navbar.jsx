import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import mainStore from "../store/mainStore";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { refresh } = mainStore();

  useEffect(() => {
    Cookies.get("token") ? setLoggedIn(true) : setLoggedIn(false);
  }, [refresh]);

  return (
    <div className=" sticky z-20 top-0">
      <div className=" flex backdrop-blur-3xl shadow-lg items-center  w-full justify-between px-10 py-5">
        <div>
          <h1 className="text-3xl font-semibold text-[#FF6B35]">PlayBoxx</h1>
        </div>

        <div className=" w-[50%] flex items-center justify-between font-medium">
          <Link to="/" className="bg-[#269475] px-2 rounded py-0.5 text-white">
            Book a spot
          </Link>
          <Link to={"/"}>Find your sport</Link>
          <Link to={"/"}>About</Link>
          <Link to={"/"}>Join Us</Link>
          <Link to={"/"}>Contact</Link>
          {loggedIn ? (
            <i className="fa-solid fa-user"></i>
          ) : (
            <Link
              to={"/auth"}
              className="bg-[#FF6B35] text-white px-2 py-1 rounded"
            >
              Login/Signup
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
