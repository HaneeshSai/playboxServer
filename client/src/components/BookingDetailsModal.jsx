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
    <div className="fixed z-20 flex items-start  justify-center h-full w-full top-0 left-0 bg-[#0000009b]">
      <div className="bg-white p-3 rounded mt-32 w-full mx-36 px-10 flex flex-col items-start">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-semibold">Please Fill The Form</h1>
          <div onClick={() => setShowBookingModal(false)}>
            <i className="fa-regular text-xl cursor-pointer fa-circle-xmark"></i>
          </div>
        </div>
        <div className="flex w-full items-start gap-10">
          {specialSession ? (
            <div className="flex-[0.5] pt-4">
              <p className="text-lg font-medium">You are Joining a Team</p>
              <div className="mt-2">
                <label htmlFor="" className="font-medium">
                  Enter your Name:{" "}
                </label>
                <input
                  type="text"
                  className="px-1.5 py-0.5 rounded-sm outline-none border border-slate-600"
                  placeholder="Kiran's Cricket Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="" className="font-medium">
                  Enter your Team Size:{" "}
                </label>
                <input
                  type="number"
                  className="pl-1.5 py-0.5 rounded-sm outline-none border border-slate-600"
                  placeholder="10"
                  value={currentTeamSize}
                  onChange={(e) => setCurrentTeamSize(e.target.value)}
                />
              </div>
              <p>
                This Current Booking Requires more{" "}
                <span className="font-semibold">
                  {
                    lookingBookings?.bookings[
                      chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                    ].extraPlayersNeeded
                  }
                </span>{" "}
                players
              </p>

              <p>
                You will be Joining <br /> Team Name:{" "}
                <span className="font-semibold">
                  {
                    lookingBookings?.bookings[
                      chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                    ].teamName
                  }
                </span>{" "}
                at <br />
                <span className="font-semibold">
                  {lookingTimings.slice(0, -2)}{" "}
                  {lookingTimings[lookingTimings.length - 1] === "c"
                    ? "Today"
                    : "Tomorrow"}
                </span>
              </p>
              <p>
                Sport:{" "}
                <span className="font-semibold capitalize">
                  {
                    lookingBookings?.bookings[
                      chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                    ].sport
                  }
                </span>
              </p>
            </div>
          ) : (
            <div className="flex-[0.5]">
              <div className="mt-4">
                <label htmlFor="" className="font-medium">
                  Enter a Team Name:{" "}
                </label>
                <input
                  type="text"
                  className="px-1.5 py-0.5 rounded-sm outline-none border border-slate-600"
                  placeholder="Kiran's Cricket Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="" className="font-medium">
                  Enter your Team Size:{" "}
                </label>
                <input
                  type="number"
                  className="pl-1.5 py-0.5 rounded-sm outline-none border border-slate-600"
                  placeholder="10"
                  value={currentTeamSize}
                  onChange={(e) => setCurrentTeamSize(e.target.value)}
                />
              </div>
              <div>
                <p className="font-medium">Need Extra Players?</p>
                <div className="flex gap-10">
                  <label htmlFor="" className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() => SetNeedExtraPlayers(true)}
                      checked={needExtraPlayers}
                    />
                    Yes
                  </label>
                  <label htmlFor="" className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={() => {
                        SetNeedExtraPlayers(false);
                        setTotalTeamSize(0);
                      }}
                      checked={!needExtraPlayers}
                    />
                    No
                  </label>
                </div>
              </div>
              {needExtraPlayers ? (
                <>
                  <div className="">
                    <label htmlFor="" className="font-medium">
                      Number of Extra Players:{" "}
                    </label>
                    <input
                      type="number"
                      className="pl-1.5 py-0.5 rounded-sm outline-none border border-slate-600"
                      placeholder="10"
                      value={totalTeamSize}
                      onChange={(e) => setTotalTeamSize(e.target.value)}
                    />
                    <p className="text-red-600 font-semibold">
                      Total Team Size: {currentTeamSize}/
                      {Number(totalTeamSize) + Number(currentTeamSize)}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          )}

          <div className="flex-[1]">
            <p className="font-medium">Choose Your Sport</p>

            <div className="flex gap-2">
              {chosenBoxId?.sports.split(",").map((e, i) => (
                <div
                  onClick={() => setSelectedSport(e)}
                  className={`p-2 ${
                    selectedSport !== e ? "bg-white" : "bg-slate-200"
                  } rounded border cursor-pointer border-slate-700`}
                  key={i}
                >
                  <img className="h-5 " src={icons[e]} alt="" />
                </div>
              ))}
            </div>
            <p className="font-medium">Choose Your Session</p>

            <div className="grid mt-2 grid-cols-5 text-sm gap-2">
              {chosenBoxId.sessions?.map((f, i) => (
                <div key={i}>
                  {chosenBoxId.waitingBooking.includes(f) ||
                  (f !== "Next Day" &&
                    f.split("-")[0].split(":")[1][0] === "3" &&
                    (chosenBoxId.waitingBooking.includes(
                      checkIfHalf(f).split("_")[0]
                    ) ||
                      chosenBoxId.waitingBooking.includes(
                        checkIfHalf(f).split("_")[1]
                      ))) ? (
                    <div className="text-nowrap w-full px-1 items-center text-sm justify-center border cursor-pointer border-slate-700 rounded-sm font-medium text-center bg-yellow-100">
                      <p className="flex items-center justify-center">
                        {f.split(",")[0]}
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (
                          chosenBoxId.bookingLooking.includes(f) ||
                          (f !== "Next Day" &&
                            f.split("-")[0].split(":")[1][0] === "3" &&
                            (chosenBoxId.bookingLooking.includes(
                              checkIfHalf(f).split("_")[0]
                            ) ||
                              chosenBoxId.bookingLooking.includes(
                                checkIfHalf(f).split("_")[1]
                              )))
                        ) {
                          setLookingTimings(f);
                          setTimings([]);
                          setSpecialSession(true);
                        } else if (
                          chosenBoxId.booked.includes(f) ||
                          (f !== "Next Day" &&
                            f.split("-")[0].split(":")[1][0] === "3" &&
                            (chosenBoxId.booked.includes(
                              checkIfHalf(f).split("_")[0]
                            ) ||
                              chosenBoxId.booked.includes(
                                checkIfHalf(f).split("_")[1]
                              )))
                        ) {
                          return;
                        } else {
                          setSpecialSession(false);
                          setTimings((prevTimings) => {
                            if (prevTimings.includes(f)) {
                              return prevTimings.filter((time) => time !== f);
                            } else {
                              return [...prevTimings, f];
                            }
                          });
                        }
                      }}
                      className={`text-nowrap w-full px-1 items-center text-sm justify-center border border-slate-700 rounded-sm font-medium ${
                        chosenBoxId.booked.includes(f)
                          ? "bg-red-200  cursor-not-allowed"
                          : f !== "Next Day" &&
                            f.split("-")[0].split(":")[1][0] === "3" &&
                            (chosenBoxId.booked.includes(
                              checkIfHalf(f).split("_")[0]
                            ) ||
                              chosenBoxId.booked.includes(
                                checkIfHalf(f).split("_")[1]
                              ))
                          ? "bg-red-200 cursor-not-allowed"
                          : chosenBoxId.bookingLooking.includes(f)
                          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white cursor-pointer"
                          : f !== "Next Day" &&
                            f.split("-")[0].split(":")[1][0] === "3" &&
                            (chosenBoxId.bookingLooking.includes(
                              checkIfHalf(f).split("_")[0]
                            ) ||
                              chosenBoxId.bookingLooking.includes(
                                checkIfHalf(f).split("_")[1]
                              ))
                          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white cursor-pointer"
                          : timings.includes(f)
                          ? "bg-green-400 cursor-pointer"
                          : "bg-green-200 cursor-pointer"
                      }   text-center`}
                    >
                      <p className="flex items-center justify-center">
                        {f.split(",")[0]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2">
              Total Price:{" "}
              {specialSession ? (
                <span>
                  {lookingBookings?.bookings[
                    chosenBoxId?.bookingLooking.indexOf(lookingTimings)
                  ].splitPricePerPlayer * Number(currentTeamSize)}
                </span>
              ) : (
                <span className="text-xl font-semibold">
                  {needExtraPlayers
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
                  /-
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="w-full text-center">
          <button
            onClick={handleSubmit}
            className="w-full  mt-3 bg-orange-600 text-white font-medium rounded py-1"
          >
            Confirm Booking
          </button>
          <p className="text-xs text-red-700 font-medium">
            Note: You will be redirected to the Payment Page. Others can Book
            the Box if they make the payment before you do.
          </p>
        </div>
      </div>
    </div>
  );
}
