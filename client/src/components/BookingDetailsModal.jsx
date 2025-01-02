import React, { useEffect, useState } from "react";
import mainStore from "../store/mainStore";
import cricket from "../assets/icons/cricket.png";
import basketball from "../assets/icons/basketball.png";
import tennis from "../assets/icons/tennis.png";
import swimming from "../assets/icons/swimming.png";
import football from "../assets/icons/football.png";
import badminton from "../assets/icons/badminton.png";
const icons = { cricket, basketball, tennis, swimming, football, badminton };
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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

export default function BookingDetailsModal() {
  const [teamName, setTeamName] = useState("");
  const [totalTeamSize, setTotalTeamSize] = useState(0);
  const [currentTeamSize, setCurrentTeamSize] = useState(0);
  const [selectedSport, setSelectedSport] = useState(null);
  const [timings, setTimings] = useState([]);
  const [specialSession, setSpecialSession] = useState(false);
  const [needExtraPlayers, SetNeedExtraPlayers] = useState(false);
  const { chosenBoxId, setShowBookingModal, refreshNow } = mainStore();
  const [lookingBookings, setLookingBookings] = useState([]);
  const [lookingTimings, setLookingTimings] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!specialSession) {
      if (teamName.length < 5)
        return toast.error("Team name should be at least 5 characters.");
      if (Number(currentTeamSize) === 0)
        return toast.error("Team Size should be at least 1.");
      if (
        needExtraPlayers &&
        totalTeamSize + currentTeamSize === currentTeamSize
      )
        return toast.error(
          "If you need extra players, please enter the number of extra players you need."
        );
      if (!selectedSport) return toast.error("Choose your desired sport");
      if (timings.length === 0) return toast.error("Choose a valid session");

      try {
        const computedTotalTeamSize =
          Number(currentTeamSize) + Number(totalTeamSize);

        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}user/createbooking`,
          {
            data: {
              teamName,
              needExtraPlayers,
              totalTeamSize: computedTotalTeamSize,
              currentTeamSize,
              sport: selectedSport,
              timings: timings,
              price:
                Math.ceil(
                  Math.round(
                    (chosenBoxId.price /
                      (Number(totalTeamSize) + Number(currentTeamSize))) *
                      timings.length *
                      Number(currentTeamSize)
                  ) / 10
                ) * 10,
              actualPrice: chosenBoxId?.price,
              token: Cookies.get("token"),
              boxId: chosenBoxId.id,
            },
          }
        );

        toast.success(response?.data.msg);
        setTeamName("");
        setSelectedSport(null);
        setTotalTeamSize(0);
        setCurrentTeamSize(0);
        setTimings([]);
        refreshNow();
        setShowBookingModal(false);
        navigate(`/payment/${response?.data.bookingId}`);
      } catch (error) {
        toast.error("Internal Server Error");
        console.log(error);
      }
    } else {
      if (teamName.length < 5)
        return toast.error("Your name should be atleast 5 characters");
      if (Number(currentTeamSize) === 0)
        return toast.error("Team Size should be at least 1.");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}user/joinexistingteam`,
          {
            data: {
              teamName,
              currentTeamSize,
              price:
                lookingBookings?.bookings[
                  chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                ].splitPricePerPlayer * currentTeamSize,
              token: Cookies.get("token"),
              bookingId:
                lookingBookings?.bookings[
                  chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                ].id,
            },
          }
        );
        toast.success(response?.data.message);

        refreshNow();
        setShowBookingModal(false);
        navigate(`/extraplayerspayment/${response?.data.id}`);
      } catch (error) {
        toast.error("Internal Server Error");
        console.log(error);
      }
    }
  };

  const getLookingBookings = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}box/getlookingbookings`,
        { boxId: chosenBoxId?.id }
      );
      setLookingBookings(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error!");
    }
  };

  useEffect(() => {
    getLookingBookings();
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 sm:my-5">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Please Fill The Form
          </h2>
          <button
            onClick={() => setShowBookingModal(false)}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <i className="fa-regular fa-circle-xmark text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left Column - Form Fields */}
              <div className="flex-1 space-y-6">
                {specialSession ? (
                  // Special Session Form
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      You are Joining a Team
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Enter your Name
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Enter your Team Size
                        </label>
                        <input
                          type="number"
                          value={currentTeamSize}
                          onChange={(e) => setCurrentTeamSize(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                          placeholder="Number of players"
                        />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <p className="text-sm text-gray-600">
                          This Current Booking Requires{" "}
                          <span className="font-semibold text-gray-900">
                            {lookingBookings?.bookings[
                              chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                            ]?.extraPlayersNeeded || 0}
                          </span>{" "}
                          more players
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Team Name:{" "}
                            <span className="font-medium text-gray-900">
                              {lookingBookings?.bookings[
                                chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                              ]?.teamName}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Time:{" "}
                            <span className="font-medium text-gray-900">
                              {lookingTimings?.slice(0, -2)}{" "}
                              {lookingTimings?.[lookingTimings.length - 1] === "c"
                                ? "Today"
                                : "Tomorrow"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Sport:{" "}
                            <span className="font-medium capitalize text-gray-900">
                              {lookingBookings?.bookings[
                                chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                              ]?.sport}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular Booking Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Enter a Team Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                        placeholder="Team name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Enter your Team Size
                      </label>
                      <input
                        type="number"
                        value={currentTeamSize}
                        onChange={(e) => setCurrentTeamSize(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                        placeholder="Number of players"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Need Extra Players?
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={() => SetNeedExtraPlayers(true)}
                            checked={needExtraPlayers}
                            className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={() => {
                              SetNeedExtraPlayers(false);
                              setTotalTeamSize(0);
                            }}
                            checked={!needExtraPlayers}
                            className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                    {needExtraPlayers && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Number of Extra Players
                        </label>
                        <input
                          type="number"
                          value={totalTeamSize}
                          onChange={(e) => setTotalTeamSize(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                          placeholder="Number of extra players needed"
                        />
                        <p className="text-sm font-medium text-gray-900">
                          Total Team Size:{" "}
                          <span className="text-[#FF6B35]">
                            {currentTeamSize}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-green-600">
                            {Number(totalTeamSize) + Number(currentTeamSize)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Sport Selection & Sessions */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Choose Your Sport
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {chosenBoxId?.sports.split(",").map((sport, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSport(sport)}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedSport === sport
                            ? "bg-gray-100 border-gray-300"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <img className="h-6 w-6" src={icons[sport]} alt={sport} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Choose Your Session
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {chosenBoxId.sessions?.map((session, i) => {
                      const isWaiting =
                        chosenBoxId.waitingBooking.includes(session);
                      const isBooked = chosenBoxId.booked.includes(session);
                      const isLooking =
                        chosenBoxId.bookingLooking.includes(session);
                      const isSelected = timings.includes(session);

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (isLooking) {
                              setLookingTimings(session);
                              setTimings([]);
                              setSpecialSession(true);
                            } else if (!isBooked && !isWaiting) {
                              setSpecialSession(false);
                              setTimings((prev) =>
                                prev.includes(session)
                                  ? prev.filter((t) => t !== session)
                                  : [...prev, session]
                              );
                            }
                          }}
                          disabled={isBooked || isWaiting}
                          className={`px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            isWaiting
                              ? "bg-yellow-100 border border-yellow-200 text-yellow-800"
                              : isBooked
                              ? "bg-red-100 border border-red-200 text-red-800 cursor-not-allowed"
                              : isLooking
                              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white"
                              : isSelected
                              ? "bg-green-500 text-white"
                              : "bg-green-100 border border-green-200 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {session.split(",")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Total Price:
                    </span>
                    <span className="text-xl font-semibold text-gray-900">
                      ₹
                      {specialSession
                        ? lookingBookings?.bookings[
                            chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                          ]?.splitPricePerPlayer * Number(currentTeamSize)
                        : needExtraPlayers
                        ? Number(currentTeamSize) > 0
                          ? Math.ceil(
                              Math.round(
                                (chosenBoxId.price /
                                  (Number(totalTeamSize) +
                                    Number(currentTeamSize))) *
                                  timings.length *
                                  Number(currentTeamSize)
                              ) / 10
                            ) * 10
                          : 0
                        : chosenBoxId.price * timings.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 sm:p-6 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#FF6B35] text-white font-medium rounded-lg py-2 px-4 hover:bg-[#ff6b35e0] transition-colors"
          >
            Confirm Booking
          </button>
          <p className="mt-2 text-xs text-center text-red-600">
            Note: You will be redirected to the Payment Page. Others can Book the
            Box if they make the payment before you do.
          </p>
        </div>
      </div>
    </div>
  );
}