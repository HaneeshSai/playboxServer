import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getSessions from "../utils/getSessions";
import cricket from "../assets/icons/cricket.png";
import basketball from "../assets/icons/basketball.png";
import tennis from "../assets/icons/tennis.png";
import swimming from "../assets/icons/swimming.png";
import football from "../assets/icons/football.png";
import badminton from "../assets/icons/badminton.png";
import mainStore from "../store/mainStore";
const icons = { cricket, basketball, tennis, swimming, football, badminton };
import Cookies from "js-cookie";
import convertFromDateTimeRange from "../utils/convertDateTimeToString";
import toast from "react-hot-toast";

const checkIfHalf = (input) => {
  if (input === "Next Day") return input;
  const lastHr = input.split("-");

  if (lastHr[0].split(":")[1][0] === "3") {
    const fHr = `${lastHr[0].split(":")[0]}`;
    const fPer = lastHr[0].slice(-2);
    const secHr = `${
      Number(fHr) + 1 > 12 ? (Number(fHr) + 1) % 12 : Number(fHr) + 1
    }`;
    const secPer =
      fHr === "11" && fPer === "am"
        ? "pm"
        : fHr === "11" && fPer === "pm"
        ? "am"
        : fPer;
    const thHr = `${
      Number(secHr) + 1 > 12 ? (Number(secHr) + 1) % 12 : Number(secHr) + 1
    }`;
    const thPer =
      thHr === "11" && secPer === "am"
        ? "pm"
        : thHr === "11" && secPer === "pm"
        ? "am"
        : secPer;

    const firstSeg = `${fHr}:00${fPer}-${secHr}:00${secPer},${
      input[input.length - 1]
    }_${secHr}:00${secPer}-${thHr}:00${thPer},${input[input.length - 1]}`;
    return firstSeg;
  } else {
    return input;
  }
};

export default function BoxCard({ e }) {
  const navigate = useNavigate();
  const { setChosenBoxId, setShowBookingModal } = mainStore();
  const [booked, setBooked] = useState([]);
  const [bookingLooking, setbookingLooking] = useState([]);
  const [waitingBooking, setWaitingBooking] = useState([]);
  const [firstSessesion, setFirstSession] = useState("");

  useEffect(() => {
    if (e?.booking.length > 0) {
      let result = [];
      let looking = [];
      let waiting = [];
      e.booking.forEach((booking) => {
        const timingSegments = booking.timing.split("_"); // Split at "_"
        timingSegments.forEach((segment) => {
          const converted = convertFromDateTimeRange(segment);
          const newSes = checkIfHalf(converted);
          if (newSes.length > 20) {
            if (booking.status === "waiting for Payment") {
              waiting.push(newSes.split("_")[0]);
              waiting.push(newSes.split("_")[1]);
            } else if (booking.currentTeamSize < booking.totalTeamSize) {
              looking.push(newSes.split("_")[0]);
              looking.push(newSes.split("_")[1]);
            } else {
              result.push(newSes.split("_")[0]);
              result.push(newSes.split("_")[1]);
            }
          } else {
            if (booking.status === "waiting for Payment") {
              waiting.push(newSes);
            } else if (booking.currentTeamSize < booking.totalTeamSize) {
              looking.push(newSes);
            } else {
              result.push(newSes);
            }
          }
        });
      });

      setBooked(result);
      setbookingLooking(looking);
      setWaitingBooking(waiting);
    }
  }, [e.booking]);

  useEffect(() => {
    setFirstSession(getSessions(e?.timings)[0]);
  }, [e.booking]);

  return (
     <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Looking for Players Badge */}
      {e?.currentStatus[0].currentTeamSize < e?.currentStatus[0].totalTeamSize && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white text-sm font-semibold py-1.5 px-3 rounded-bl-lg">
            Looking for Players
          </div>
        </div>
      )}

      {/* Image and Sports Icons */}
      <div className="relative" onClick={() => navigate(`/box/${e?.currentStatus[0].boxId}`)}>
        <img
          src="https://playo.gumlet.io/7STRIKERS20231214115324318292/7Strikers1715227865223.jpg?w=700&format=webp&q=30"
          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          alt={e?.placeName}
        />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {e?.availableSports.split(",").map((sport, i) => (
            <div 
              key={i}
              className="p-2 bg-white rounded-full shadow-md backdrop-blur-sm bg-white/90 transition-transform hover:scale-110"
            >
              <img className="h-5 w-5" src={icons[sport]} alt={sport} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate pr-2">{e?.placeName}</h3>
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-star text-yellow-400"></i>
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>

        {/* Location and Status */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">{e?.area}</p>
          <div className="flex items-center gap-1.5">
            {firstSessesion && (
              <>
                {waitingBooking.includes(firstSessesion) ? (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-hourglass-half text-yellow-500"></i>
                    <span className="text-yellow-500 font-medium">Waiting</span>
                  </span>
                ) : e?.currentStatus[0].currentTeamSize === e?.currentStatus[0].totalTeamSize ? (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-dot text-red-600"></i>
                    <span className="text-red-600 font-medium">Occupied</span>
                  </span>
                ) : e?.currentStatus[0].currentTeamSize === 0 ? (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-dot text-green-600"></i>
                    <span className="text-green-600 font-medium">Available</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-dot text-yellow-400"></i>
                    <span className="text-yellow-400 font-medium">Looking</span>
                  </span>
                )}
                {e?.currentStatus[0].currentTeamSize < e?.currentStatus[0].totalTeamSize && (
                  <span className="font-medium">
                    <span className="text-red-600">{e?.currentStatus[0].currentTeamSize}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-green-600">{e?.currentStatus[0].totalTeamSize}</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {getSessions(e?.timings).map((slot, i) => {
            const isWaiting = waitingBooking.includes(slot);
            const isBooked = booked.includes(slot);
            const isLooking = bookingLooking.includes(slot);
            
            return (
              <div
                key={i}
                onClick={() => {
                  if (isLooking) {
                    toast.success("Clicked on players needed session");
                  }
                }}
                className={`
                  px-2 py-1 text-xs font-medium rounded border transition-colors
                  ${isWaiting ? 'bg-yellow-100 border-yellow-200 text-yellow-800' : 
                    isBooked ? 'bg-red-100 border-red-200 text-red-800' :
                    isLooking ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white border-transparent' :
                    'bg-green-100 border-green-200 text-green-800'}
                  ${isLooking ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}
                `}
              >
                <p className="text-center truncate">
                  {slot.split(",")[0]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Book Now Button */}
        <button
          onClick={() => {
            if (!Cookies.get("token")) {
              navigate("/auth");
              return;
            }

            setChosenBoxId({
              id: e?.currentStatus[0].boxId,
              sessions: getSessions(e?.timings),
              price: e?.currentStatus[0].price,
              sports: e?.availableSports,
              booked,
              bookingLooking,
              waitingBooking,
              firstSessesion,
            });
            setShowBookingModal(true);
          }}
          className="w-full bg-[#269475] hover:bg-[#1b493c] text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>Book Now at</span>
          <span className="font-semibold">₹{e?.currentStatus[0].price}</span>
        </button>
      </div>
    </div>
  );
}

