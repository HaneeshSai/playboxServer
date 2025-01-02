import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import cricket from "../assets/icons/cricket.png";
import basketball from "../assets/icons/basketball.png";
import tennis from "../assets/icons/tennis.png";
import swimming from "../assets/icons/swimming.png";
import football from "../assets/icons/football.png";
import badminton from "../assets/icons/badminton.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import mainStore from "../store/mainStore";
import convertFromDateTimeRange from "../utils/convertDateTimeToString";
import getSessions from "../utils/getSessions";
const icons = { cricket, basketball, tennis, swimming, football, badminton };

const formatDateTime = (sdate) => {
  const date = new Date(sdate);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  return `${hours}:${minutes} ${ampm} - ${day}, ${month}`;
};

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

export default function Box() {
  const { id } = useParams();
  const [details, setDetails] = useState();
  const [booked, setBooked] = useState([]);
  const [bookingLooking, setbookingLooking] = useState([]);
  const [waitingBooking, setWaitingBooking] = useState([]);
  const [firstSessesion, setFirstSession] = useState("");
  const { setChosenBoxId } = mainStore();
  const navigate = useNavigate();

  useEffect(() => {
    getBoxDetails();
  }, [id]);

  const getBoxDetails = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}box/getbox`,
        { id: id }
      );
      setDetails(response?.data);
    } catch (error) {
      toast.error("Internal Server Error!");
      console.log(error);
    }
  };
  const { setShowBookingModal } = mainStore();

  useEffect(() => {
    if (details?.booking.length > 0) {
      let result = [];
      let looking = [];
      let waiting = [];
      details.booking.forEach((booking) => {
        const timingSegments = booking.timing.split("_"); // Split at "_"
        timingSegments.forEach((segment) => {
          const converted = convertFromDateTimeRange(segment);
          const newSes = checkIfHalf(converted);
          console.log(booking.status);
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
  }, [details?.booking]);

  useEffect(() => {
    if (details?.timings) {
      setFirstSession(getSessions(details?.timings)[0]);
    }
  }, [details?.booking]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="w-full">
            <img
              src="https://playo.gumlet.io/7STRIKERS20231214115324318292/7Strikers1715227865223.jpg?w=700&format=webp&q=30"
              alt={details?.placeName}
              className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold truncate">
              {details?.placeName}
            </h1>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-gray-600"></i>
                <span className="font-medium">{details?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-envelope text-gray-600"></i>
                <span className="font-medium">{details?.email}</span>
              </div>
            </div>
            {/* Status */}
            <div className="text-lg">
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
              ) : details?.currentStatus[0].currentTeamSize ===
                  details?.currentStatus[0].totalTeamSize &&
                details?.currentStatus[0].currentTeamSize !== 0 ? (
                <span>
                  <i className="fa-solid text-red-600 fa-circle-dot"></i>{" "}
                  Occupied
                </span>
              ) : details?.currentStatus[0].currentTeamSize === 0 ? (
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
              {details?.currentStatus[0].currentTeamSize <
              details?.currentStatus[0].totalTeamSize ? (
                <>
                  <span
                    className={`${
                      details?.currentStatus[0].currentTeamSize <
                      details?.currentStatus[0].totalTeamSize
                        ? "text-red-600"
                        : "text-green-500"
                    } font-semibold`}
                  >
                    : {details?.currentStatus[0].currentTeamSize}
                  </span>

                  <span className="text-green-500 font-semibold">
                    /{details?.currentStatus[0].totalTeamSize}
                  </span>
                </>
              ) : null}
              </p>
              </div>

            {/* Available Sports */}
            <div className="space-y-4">
              <p className="font-medium">Available Sports:</p>
              <div className="flex flex-wrap gap-4">
                {details?.availableSports.split(",").map((sport, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white border border-slate-700 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <img className="h-6" src={icons[sport]} alt={sport} />
                  </div>
                ))}
                <div className="flex items-center">
                  <p className="text-2xl sm:text-4xl font-medium">
                    <span className="text-xl sm:text-2xl">at</span> ₹
                    {details?.currentStatus[0].price}
                    <span className="font-normal text-lg sm:text-2xl">/hr</span>
                  </p>
                </div>
              </div>
            </div>
            
             {/* Time Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto">
              {details &&
                getSessions(details?.timings).map((f, i) => (
                  <div key={i}>
                    {waitingBooking.includes(f) ||
                    (f !== "Next Day" &&
                      f.split("-")[0].split(":")[1][0] === "3" &&
                      (waitingBooking.includes(checkIfHalf(f).split("_")[0]) ||
                        waitingBooking.includes(
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
                                bookingLooking.includes(
                                  checkIfHalf(f).split("_")[1]
                                ))
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (!Cookies.get("token")) {
                    Cookies.set("lastViewedBox", id);
                    navigate("/auth");
                    return;
                  }

                  setChosenBoxId({
                    id: details?.currentStatus[0].boxId,
                    sessions: getSessions(details?.timings),
                    price: details?.currentStatus[0].price,
                    sports: details?.availableSports,
                    booked: booked,
                    bookingLooking,
                    waitingBooking,
                    firstSessesion,
                  });
                  setShowBookingModal(true);
                }}
                 className="flex-1 bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF6B35]/90 transition-colors"
              >
                Book Now
              </button>
              <button className="flex-1 bg-white border border-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Share Spot
              </button>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <p className="text-xl font-medium">
                Location:{" "}
                <span className="text-lg font-normal">
                  {details?.fullAddress || "Not Available"}
                </span>
              </p>
              <div className="w-full h-[200px] sm:h-[300px] rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60927.792882490896!2d78.40417934863282!3d17.364355900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99361804411d%3A0x3588926f24f07fe8!2sBOX%20CRICKET-MARS%20SPORTS%20CLUB!5e0!3m2!1sen!2sin!4v1732458484118!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Information */}
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{details?.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Rules</h2>
            <p className="text-gray-600">{details?.rules}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Refund Policy</h2>
            <p className="text-gray-600">{details?.refundPolicy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
