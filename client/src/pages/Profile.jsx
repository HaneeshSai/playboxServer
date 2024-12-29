import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const bookings = [
  {
    name: "Ravi Box Cricket",
    place: "Ramnagar",
    status: "Ended",
    price: "600",
    time: "12 November, 2024 - 5:00am - 6:00am",
  },
  {
    name: "Ravi Box Cricket",
    place: "Ramnagar",
    status: "Waiting for Payment",
    price: "600",
    time: "13 November, 2024 - 5:00pm - 6:00pm",
  },
  {
    name: "Ravi Box Cricket",
    place: "Ramnagar",
    status: "Confirmed",
    price: "600",
    time: "12 November, 2024 - 9:00pm - 10:00pm",
  },
];

export default function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}user/getuserprofile`,
          {
            token: Cookies.get("token"),
          }
        );
        console.log(response?.data.details);
        setData(response?.data.details);
      } catch (error) {
        console.log(error);
        toast.error("Internal Server Error");
      }
    };

    getProfile();
  }, []);
  return (
    <div className="mx-56">
      <h1 className="text-center text-3xl font-semibold my-10">Your Profile</h1>
      <div>
        <p className="text-2xl font-semibold">
          Hey {data?.fullName}, Heres what you are looking for
        </p>
        <p>Name: {data?.fullName}</p>
        <p>Email: {data?.email}</p>
        <p>Phone: {data?.phone}</p>
        <button
          disabled={!data?.owner}
          className={`bg-orange-600 ${
            data?.owner ? "cursor-pointer" : "cursor-not-allowed"
          } px-3 py-1 rounded mt-2 text-white font-medium`}
        >
          Access Owner Portal
        </button>{" "}
        {!data?.owner && (
          <p className="text-red-600 font-medium">
            (You Cannot access the Owners Portal as you do not own a Box Venue)
          </p>
        )}
      </div>
      <div className="mt-10 pb-20">
        <h1 className="text-2xl font-semibold">Your Bookings</h1>
        <div className="flex flex-col gap-5">
          {bookings.map((e, i) => (
            <div className="flex bg-white shadow-lg p-5 rounded-xl mt-3 justify-between items-center">
              <div>
                <p className="text-xl font-medium">{e.name}</p>
                <p>{e.place}</p>
              </div>
              <p className="text-lg font-medium">₹{e.price}</p>
              <p>@{e.time}</p>
              <p>{e.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
