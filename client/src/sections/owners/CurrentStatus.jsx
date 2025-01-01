import React, { useState } from "react";
import checkIfOpen from "../../utils/checkIfOpen";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import mainStore from "../../store/mainStore";

const c = {
  status: "a",
  nextAvailableSpot: "i",
  price: 400,
  currentTeamSize: 0,
  totalTeamSize: 0,
  isOpen: true,
};

const formatDateTime = (sdate) => {
  const date = new Date(sdate);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Two-digit minutes
  const ampm = hours >= 12 ? "pm" : "am"; // Determine am/pm
  hours = hours % 12 || 12; // Convert to 12-hour format
  const day = date.getDate(); // Day of the month
  const month = date.toLocaleString("default", { month: "short" }); // Short month name (e.g., Jan, Feb)

  return `${hours}:${minutes} ${ampm} - ${day}, ${month}`;
};

const formatDateTimeInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export default function CurrentStatus({ currentDetails, timings }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [newDetails, setNewDetails] = useState(null);
  const { refreshNow } = mainStore();

  useEffect(() => {
    setNewDetails(currentDetails);
  }, [currentDetails]);

  const onUpdate = async () => {
    if (
      currentDetails.status === newDetails.status &&
      currentDetails.nextAvailableSpot === newDetails.nextAvailableSpot &&
      currentDetails.currentTeamSize === newDetails.currentTeamSize &&
      currentDetails.totalTeamSize === newDetails.totalTeamSize &&
      currentDetails.price === newDetails.price
    ) {
      setShowConfirmModal(false);
      return toast.error("Nothing to Update!");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}owner/updatecurrentstatus`,
        {
          data: newDetails,
        }
      );

      toast.success(response?.data.message);
      setShowConfirmModal(false);
      refreshNow();
      return;
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <>
      {showConfirmModal ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#00000049]">
          <div className="bg-white p-5 flex flex-col items-center rounded">
            <div className="flex justify-end w-full">
              <i
                onClick={() => setShowConfirmModal(false)}
                className="fa-regular cursor-pointer hover:text-slate-600 fa-circle-xmark"
              ></i>
            </div>
            <div className="px-5 py-3 flex flex-col items-center">
              <p>Would you like to Confirm the Update?</p>
              <button
                onClick={onUpdate}
                className="text-white bg-orange-600 px-3 py-1 mt-3 rounded hover:bg-orange-400"
              >
                Yes, I Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mx-10 flex justify-around">
        <div className="inline-block p-4 px-7 rounded-xl bg-white shadow-lg">
          <div className="flex gap-2">
            <h1 className="text-xl font-medium">Status:</h1>
            <h1 className="text-xl font-medium">
              {currentDetails?.status === "a" ? (
                <span className="font-semibold text-green-700">Available</span>
              ) : currentDetails?.status === "o" ? (
                <span className="font-semibold text-red-500">Occupied</span>
              ) : currentDetails?.status === "l" ? (
                <span className="font-semibold text-yellow-300">Looking</span>
              ) : null}
            </h1>
          </div>
          <div className="flex gap-2">
            <h1 className="text-xl font-medium">Next Available Spot:</h1>
            <h1 className="text-xl font-medium">
              {currentDetails?.nextAvailableSpot === "i" ? (
                <span className="font-semibold">Immediate</span>
              ) : currentDetails?.nextAvailableSpot ? (
                <span>
                  {currentDetails?.nextAvailableSpot.length > 0
                    ? formatDateTime(currentDetails?.nextAvailableSpot)
                    : ""}
                </span>
              ) : (
                <span>Not Specified</span>
              )}
            </h1>
          </div>
          <div className="flex gap-2">
            <h1 className="text-xl font-medium">Current Team Size:</h1>
            <h1 className="text-xl font-medium">
              {currentDetails?.currentTeamSize}
            </h1>
          </div>
          <div className="flex gap-2">
            <h1 className="text-xl font-medium">Required Team Size:</h1>
            <h1 className="text-xl font-medium">
              {currentDetails?.totalTeamSize}
            </h1>
          </div>
          <div className="flex gap-2">
            <h1 className="text-xl font-medium">Price Per Hour:</h1>
            <h1 className="text-xl font-medium">
              {currentDetails?.price}/- Per Hour
            </h1>
          </div>
          <h1 className={` font-medium`}>
            {timings ? checkIfOpen(timings) : " "}
          </h1>
        </div>
        <div className="flex items-center">
          <i className="fa-solid text-black  text-6xl fa-arrow-right-long"></i>
        </div>

        <div className="p-4 px-7 rounded-xl bg-white shadow-lg">
          <div>
            <label htmlFor="">Status: </label>
            <select
              name=""
              id=""
              onChange={(e) => {
                setNewDetails((prevdata) => ({
                  ...prevdata,
                  status: e.target.value,
                }));
              }}
              className="border outline-none border-slate-800 rounded px-1"
            >
              <option value="a">Available</option>
              <option value="o">Occupied</option>
              <option value="l">Looking</option>
            </select>
          </div>
          <div className="flex my-1 gap-2">
            <label htmlFor="">Next Available Spot: </label>
            {isDatePicker ? (
              <input
                type="datetime-local"
                className="outline-none border border-slate-800 rounded px-2 flex-grow"
                value={newDetails?.nextAvailableSpot}
                onChange={(e) => {
                  setNewDetails((prevdata) => ({
                    ...prevdata,
                    nextAvailableSpot: e.target.value,
                  }));
                  setIsDatePicker(false);
                }}
                onBlur={() => setIsDatePicker(false)} // Close on blur
              />
            ) : (
              <div className="border border-slate-800 rounded px-1">
                <input
                  type="text"
                  className="outline-none flex-grow"
                  value={
                    newDetails?.nextAvailableSpot.length !== 1
                      ? formatDateTimeInput(newDetails?.nextAvailableSpot)
                      : newDetails?.nextAvailableSpot
                  }
                  onChange={(e) =>
                    setNewDetails((prevdata) => ({
                      ...prevdata,
                      nextAvailableSpot: e.target.value,
                    }))
                  }
                  placeholder="Enter 'i' for immediate"
                />
                <i
                  onClick={() => setIsDatePicker(true)}
                  className="fa-regular cursor-pointer fa-calendar px-2"
                ></i>
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-red-600">
            (Enter "i" for Immediate available Slot)
          </p>
          <div>
            <label htmlFor="">Current Team Size: </label>
            <input
              type="number"
              value={newDetails?.currentTeamSize}
              onChange={(e) => {
                setNewDetails((p) => ({
                  ...p,
                  currentTeamSize: e.target.value,
                }));
              }}
              className="border border-slate-800 rounded outline-none px-2"
            />
          </div>
          <div className="my-2">
            <label htmlFor="">Required Team Size: </label>
            <input
              type="number"
              value={newDetails?.totalTeamSize}
              onChange={(e) => {
                setNewDetails((p) => ({
                  ...p,
                  totalTeamSize: e.target.value,
                }));
              }}
              className="border border-slate-800 rounded outline-none px-2"
            />
          </div>
          <div className="my-2">
            <label htmlFor="">Price per hour: </label>
            <input
              type="number"
              onChange={(e) => {
                setNewDetails((p) => ({
                  ...p,
                  price: e.target.value,
                }));
              }}
              value={newDetails?.price}
              className="border border-slate-800 rounded outline-none px-2"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center my-10">
        <button
          onClick={() => {
            setShowConfirmModal(true);
          }}
          className="bg-[#FF6B35] text-white px-5 rounded py-2 font-medium"
        >
          Update Details
        </button>
      </div>
    </>
  );
}
