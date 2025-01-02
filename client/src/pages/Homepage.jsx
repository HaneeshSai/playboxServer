import React, { useEffect, useState } from "react";
import cricket from "../assets/imgs/cricket.png";
import badminton from "../assets/imgs/badminton.png";
import basketball from "../assets/imgs/basketball.png";
import data from "../../data.json";
import BoxCard from "../components/BoxCard";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import mainStore from "../store/mainStore";
import EventCard from "../components/EventCard";
import CoachingCard from "../components/CoachingCard";
import EventRegistrationModal from "../components/EventRegistrationModal";
import CoachingRegistrationModal from "../components/CoachingRegistrationModal";

export default function Homepage() {
  const navigate = useNavigate();
  const { city, refresh } = mainStore();
  const [boxes, setBoxes] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCoaching, setSelectedCoaching] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Cricket Tournament 2024",
      bannerImageUrl: "Cricket.png?height=400&width=600",
      prizeMoney: 50000,
      eventDate: "2024-02-15",
      teamSize: 11,
      maxTeams: 16,
      pricePerTeam: 2000,
      sportType: "Cricket",
      description: "Join us for the biggest cricket tournament of the year!"
    },
     {
    id: 2,
    name: "Basketball Championship",
    bannerImageUrl: "/Basketball.png?height=400&width=600",
    prizeMoney: 25000,
    eventDate: "2024-02-20",
    teamSize: 5,
    maxTeams: 8,
    pricePerTeam: 1500,
    sportType: "Basketball",
    description: "Annual basketball championship with exciting prizes!"
  },
   {
    id: 3,
    name: "Badminton Doubles Cup",
    bannerImageUrl: "/Badminton.png?height=400&width=600",
    prizeMoney: 15000,
    eventDate: "2024-02-25",
    teamSize: 2,
    maxTeams: 32,
    pricePerTeam: 1000,
    sportType: "Badminton",
    description: "Compete in the Badminton Doubles Cup and win amazing prizes!"
  }
  ]);

  const [coaching, setCoaching] = useState([
  {
    id: "1",
    name: "Professional Cricket Coaching",
    bannerImageUrl: "/Cricket.png?height=400&width=600",
    coachName: "Rakshit Mishra",
    durationWeeks: 12,
    price: 15000,
    sportType: "Cricket",
    description: "Learn cricket from experienced professionals"
  },
  {
    id: "2",
    name: "Basketball Training Program",
    bannerImageUrl: "/Basketball.png?height=400&width=600",
    coachName: "Andrew Tate",
    durationWeeks: 8,
    price: 10000,
    sportType: "Basketball",
    description: "Comprehensive basketball training program"
  },
  {
    id: "3",
    name: "Badminton Master Class",
    bannerImageUrl: "/Badminton.png?height=400&width=600",
    coachName: "Elon Musk",
    durationWeeks: 4,
    price: 2500,
    sportType: "Badminton",
    description: "Master the game of badminton with expert coaching"
  }
]);

  useEffect(() => {
    city ? getBoxes() : null;
  }, [city, refresh]);

  const getBoxes = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}box/getboxes`,
        {
          city: city,
        }
      );
      setBoxes(response.data.boxes);
      // console.log(response.data.boxes);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="h-full flex flex-col gap-12 sm:gap-16 lg:gap-32">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden bg-gradient-to-b from-orange-50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block text-[#FF6B35] mb-2">PlayBoxx</span>
                <span className="text-gray-900">Finding Box Sports for you!</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                We connect you with nearby Box sports and match you with the Perfect team!
              </p>
              
              {/* Search Bar */}
              <div className="mt-8 sm:mt-10 max-w-md mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200">
                      <i className="fa-solid fa-magnifying-glass text-gray-400 pl-4"></i>
                      <input
                        className="w-full py-3 px-3 rounded-lg outline-none"
                        type="text"
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Search Your Location"
                      />
                    </div>
                  </div>
                  <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#ff6b35e0] transition-colors shadow-lg">
                    Search
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button className="bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#ff6b35e0] transition-colors shadow-lg w-full sm:w-auto">
                  Book Your Spot Now
                </button>
                <button className="bg-[#269475] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#269475e0] transition-colors shadow-lg w-full sm:w-auto">
                  Contact us
                </button>
              </div>
            </div>

            {/* Image Section - Improved for mobile */}
            <div className="flex-1 relative w-full max-w-[500px] mx-auto lg:mx-0">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                {/* Background blur effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent rounded-full filter blur-3xl"></div>
                
                {/* Images with improved positioning and animations */}
                <div className="absolute inset-0">
                  <img
                    src={cricket}
                    className="absolute w-32 sm:w-40 lg:w-56 h-auto z-10 top-[5%] left-1/2 -translate-x-1/2 lg:left-[10%] lg:translate-x-0 hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    alt="Cricket"
                  />
                  <img
                    src={badminton}
                    className="absolute w-28 sm:w-36 lg:w-48 h-auto z-10 top-[40%] right-[5%] hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    alt="Badminton"
                  />
                  <img
                    src={basketball}
                    className="absolute w-32 sm:w-40 lg:w-52 h-auto z-10 bottom-[5%] left-[5%] hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                    alt="Basketball"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-200 rounded-full filter blur-3xl opacity-20"></div>
        </div>
      </div>
      <div className="px-4 sm:px-8 lg:px-24">
        <h1 className="text-3xl font-semibold">Nearest Box Sports Places.</h1>
        <p className="text-">
          <i className="fa-solid text-[#269475] mr-2 fa-circle-dot"></i>
          {city ? city : ""}
        </p>
        <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10">
          {boxes?.length > 0
            ? boxes.map((e, i) => <BoxCard key={i} e={e} />)
            : null}
        </div>
      </div>
      <div className="px-4 sm:px-8 lg:px-24">
        <h1 className="text-3xl font-semibold">Upcoming Events</h1>
        <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10">
          {events?.map((event, i) => (
            <EventCard
              key={i}
              event={event}
              onRegisterClick={(event) => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Coaching Section */}
      <div className="px-4 sm:px-8 lg:px-24">
        <h1 className="text-3xl font-semibold">Professional Coaching</h1>
        <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-10">
          {coaching?.map((program, i) => (
            <CoachingCard
              key={i}
              coaching={program}
              onRegisterClick={(program) => {
                setSelectedCoaching(program);
                setShowCoachingModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Registration Modals */}
      <EventRegistrationModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
      />
      <CoachingRegistrationModal
        isOpen={showCoachingModal}
        onClose={() => setShowCoachingModal(false)}
        coaching={selectedCoaching}
      />

      <div className="px-4 sm:px-8 lg:px-24 text-2xl lg:text-3xl font-semibold">
        <h1>Our Popular Sport Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-4 lg:gap-10 mt-6 lg:mt-10">
          {data.categories.map((e, i) => (
            <div key={i} className="h-48 sm:h-64 cursor-pointer w-full lg:w-44 rounded-lg">
              <div className="relative h-full w-full rounded-lg overflow-hidden">
                <img
                  src={e.img}
                  className="h-full w-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

                {/* Add the text overlay here */}
                <p className="absolute bottom-4 left-4 text-xl text-white z-20">
                  {e.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 sm:mx-8 lg:mx-24 flex flex-col items-center text-center">
        <h1 className="text-3xl lg:text-4xl font-semibold my-1">Do You Own a Box?</h1>
        <p className="text-base lg:text-lg">Connect with Players and Fill Your Grounds</p>

        <div
          onClick={() => {
            Cookies.get("token") ? navigate("/boxregister") : navigate("/auth");
          }}
          className="bg-[#FF6B35] px-4 lg:px-7 text-base lg:text-lg w-full sm:w-[300px] my-6 lg:my-10 justify-center font-medium rounded-full py-1 gap-4 flex items-center text-white"
        >
          <button>Register Your Box Now</button>
          <i className="fa-solid  fa-arrow-right-long"></i>
        </div>
      </div>
      <div></div>
    </div>
  );
}

