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
        setData(response?.data.details);
      } catch (error) {
        console.log(error);
        toast.error("Internal Server Error");
      }
    };

    getProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-8">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Hey {data?.fullName}, Here's what you are looking for
        </h2>
        <div className="space-y-2">
          <p className="text-gray-600">Name: <span className="text-gray-900">{data?.fullName}</span></p>
          <p className="text-gray-600">Email: <span className="text-gray-900">{data?.email}</span></p>
          <p className="text-gray-600">Phone: <span className="text-gray-900">{data?.phone}</span></p>
        </div>
        <div className="mt-4">
          <button
            disabled={!data?.owner}
            className={`bg-[#FF6B35] px-4 py-2 rounded text-white font-medium transition-colors ${
              data?.owner ? "hover:bg-[#FF6B35]/90 cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
          >
            Access Owner Portal
          </button>
          {!data?.owner && (
            <p className="text-red-600 font-medium mt-2">
              (You Cannot access the Owner's Portal as you do not own a Box Venue)
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Your Bookings</h2>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-medium">{booking.name}</h3>
                <p className="text-gray-600">{booking.place}</p>
              </div>
              <p className="text-lg font-medium">₹{booking.price}</p>
              <p className="text-sm text-gray-600">@{booking.time}</p>
              <p className={`font-medium ${
                booking.status === 'Confirmed' ? 'text-green-600' :
                booking.status === 'Ended' ? 'text-gray-600' :
                'text-yellow-600'
              }`}>
                {booking.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

