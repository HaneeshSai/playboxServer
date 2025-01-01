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
    <div className="hover:scale-[1.02] duration-300 cardShadow rounded relative ">
      {e?.currentStatus[0].currentTeamSize <
      e?.currentStatus[0].totalTeamSize ? (
        <div className="absolute top-0 right-0">
          <button
            onClick={() => {}}
            class="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white font-bold py-2 px-4 rounded-bl-md "
          >
            Looking for Players
          </button>
        </div>
      ) : null}

      <img
        onClick={() => navigate(`/box/${e?.currentStatus[0].boxId}`)}
        src="https://playo.gumlet.io/7STRIKERS20231214115324318292/7Strikers1715227865223.jpg?w=700&format=webp&q=30&overlay=https://playo-website.gumlet.io/playo-website-v2/logos-icons/playo-logo.png&overlay_width_pct=0.2&overlay_height_pct=1&overlay_position=bottomright"
        className="w-full h-[66%] rounded object-cover"
        alt=""
      />
      <div className="flex gap-2 absolute bottom-[165px] left-4">
        {e?.availableSports.split(",").map((e, i) => (
          <div className="p-2 bg-white rounded-full" key={i}>
            <img className="h-5 " src={icons[e]} alt="" />
          </div>
        ))}
      </div>
      <div className="p-3">
        <div className=" flex items-center  justify-between">
          <p className="text-xl truncate flex-1 font-semibold">
            {e?.placeName}
          </p>
          <p>Ratings here</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg">{e?.area}</p>
          <p className=" ">
            {firstSessesion &&
            (waitingBooking.includes(firstSessesion) ||
              (firstSessesion !== "Next Day" &&
                firstSessesion?.split("-")[0].split(":")[1][0] === "3" &&
                (waitingBooking.includes(
                  checkIfHalf(firstSessesion).split("_")[0]
                ) ||
                  waitingBooking.includes(
                    checkIfHalf(firstSessesion).split("_")[1]
                  )))) ? (
              <span>
                <i className="fa-solid fa-hourglass-half"></i> Waiting for
                Confirmation
              </span>
            ) : e?.currentStatus[0].currentTeamSize ===
                e?.currentStatus[0].totalTeamSize &&
              e?.currentStatus[0].currentTeamSize !== 0 ? (
              <span>
                <i className="fa-solid text-red-600 fa-circle-dot"></i> Occupied
              </span>
            ) : e?.currentStatus[0].currentTeamSize === 0 ? (
              <span>
                <i className="fa-solid text-green-600 fa-circle-dot"></i>{" "}
                Available Now
              </span>
            ) : (
              <span>
                <i className="fa-solid text-yellow-400 fa-circle-dot"></i>{" "}
                Looking
              </span>
            )}
            {e.currentStatus[0].currentTeamSize <
            e.currentStatus[0].totalTeamSize ? (
              <>
                <span
                  className={`${
                    e?.currentStatus[0].currentTeamSize <
                    e?.currentStatus[0].totalTeamSize
                      ? "text-red-600"
                      : "text-green-500"
                  } font-semibold`}
                >
                  : {e?.currentStatus[0].currentTeamSize}
                </span>

                <span className="text-green-500 font-semibold">
                  /{e?.currentStatus[0].totalTeamSize}
                </span>
              </>
            ) : null}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-2 overflow-y-auto h-12 mt-1">
          {getSessions(e?.timings).map((f, i) => (
            <div key={i}>
              {waitingBooking.includes(f) ||
              (f !== "Next Day" &&
                f.split("-")[0].split(":")[1][0] === "3" &&
                (waitingBooking.includes(checkIfHalf(f).split("_")[0]) ||
                  waitingBooking.includes(checkIfHalf(f).split("_")[1]))) ? (
                <div className="text-nowrap w-full px-1 items-center text-sm justify-center border cursor-pointer border-slate-700 rounded-sm font-medium text-center bg-yellow-100">
                  <p className="flex items-center justify-center">
                    {f.split(",")[0]}
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (
                      bookingLooking.includes(f) ||
                      (f !== "Next Day" &&
                        f.split("-")[0].split(":")[1][0] === "3" &&
                        (bookingLooking.includes(
                          checkIfHalf(f).split("_")[0]
                        ) ||
                          bookingLooking.includes(
                            checkIfHalf(f).split("_")[1]
                          )))
                    ) {
                      toast.success("clicked on extraplayers session");
                    }
                  }}
                  className={`text-nowrap w-full px-1 items-center text-sm justify-center border cursor-pointer border-slate-700 rounded-sm font-medium ${
                    booked.includes(f)
                      ? "bg-red-200"
                      : f !== "Next Day" &&
                        f.split("-")[0].split(":")[1][0] === "3" &&
                        (booked.includes(checkIfHalf(f).split("_")[0]) ||
                          booked.includes(checkIfHalf(f).split("_")[1]))
                      ? "bg-red-200"
                      : bookingLooking.includes(f)
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white"
                      : f !== "Next Day" &&
                        f.split("-")[0].split(":")[1][0] === "3" &&
                        (bookingLooking.includes(
                          checkIfHalf(f).split("_")[0]
                        ) ||
                          bookingLooking.includes(checkIfHalf(f).split("_")[1]))
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white"
                      : "bg-green-200"
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

        <div className="flex w-full mt-1">
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
                booked: booked,
                bookingLooking,
                waitingBooking,
                firstSessesion,
              });
              setShowBookingModal(true);
            }}
            className="bg-[#269475] w-full hover:bg-[#1b493c] duration-300 text-white px-3 py-0.5 rounded"
          >
            Book Now at{" "}
            <span className="font-medium">{e?.currentStatus[0].price}/-</span>
          </button>
        </div>
      </div>
    </div>
  );
}
