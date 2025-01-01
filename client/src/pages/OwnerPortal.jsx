import React, { useState } from "react";
import { useEffect } from "react";
import mainStore from "../store/mainStore";
import CurrentStatus from "../sections/owners/CurrentStatus";
import Bookings from "../sections/owners/Bookings";
import BoxDetails from "../sections/owners/BoxDetails";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

export default function OwnerPortal() {
  const [details, setDetails] = useState();
  const [selected, setSelected] = useState(0);
  const { refresh } = mainStore();

  useEffect(() => {
    getOwnersBox();
  }, [refresh]);

  const getOwnersBox = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}owner/getownersbox`,
        {
          token: Cookies.get("token"),
        }
      );
      setDetails(response.data.box);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="my-10 mx-32 h-full">
      <h1 className="text-4xl text-center font-semibold">Welcome </h1>
      <div className="flex w-full justify-between items-center px-6 my-4 text-lg font-medium">
        <h1
          onClick={() => setSelected(0)}
          className={`${
            selected === 0 ? "bg-[#FF6B35] text-white" : "bg-white text-black"
          } px-8 rounded-full cursor-pointer py-1 whitespace-nowrap flex-shrink-0`}
        >
          Current Status
        </h1>
        <div className="border-b border-black flex-grow mx-4"></div>
        <h1
          onClick={() => setSelected(1)}
          className={`${
            selected === 1 ? "bg-[#FF6B35] text-white" : "bg-white text-black"
          } px-8 rounded-full cursor-pointer py-1 whitespace-nowrap flex-shrink-0`}
        >
          Bookings/Cancellations
        </h1>
        <div className="border-b border-black flex-grow mx-4"></div>
        <h1
          onClick={() => setSelected(2)}
          className={`${
            selected === 2 ? "bg-[#FF6B35] text-white" : "bg-white text-black"
          } px-8 rounded-full cursor-pointer py-1 whitespace-nowrap flex-shrink-0`}
        >
          Box Details
        </h1>
      </div>
      <div className="my-10 pb-10">
        {selected === 0 ? (
          <CurrentStatus
            currentDetails={details?.currentStatus[0]}
            timings={details?.timings}
          />
        ) : selected === 1 ? (
          <Bookings />
        ) : (
          <BoxDetails />
        )}
      </div>
    </div>
  );
}
