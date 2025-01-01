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
      id: "1",
      name: "Cricket Tournament 2024",
      bannerImageUrl: "cricket.png?height=400&width=600",
      prizeMoney: 50000,
      eventDate: "2024-02-15",
      teamSize: 11,
      maxTeams: 16,
      pricePerTeam: 2000,
      sportType: "Cricket",
      description: "Join us for the biggest cricket tournament of the year!"
    },
    {
      id: "2",
      name: "Basketball Championship",
      bannerImageUrl: "/placeholder.svg?height=400&width=600",
      prizeMoney: 25000,
      eventDate: "2024-02-20",
      teamSize: 5,
      maxTeams: 8,
      pricePerTeam: 1500,
      sportType: "Basketball",
      description: "Annual basketball championship with exciting prizes!"
    }
  ]);

  const [coaching, setCoaching] = useState([
    {
      id: "1",
      name: "Professional Cricket Coaching",
      bannerImageUrl: "/placeholder.svg?height=400&width=600",
      coachName: "John Smith",
      durationWeeks: 12,
      price: 15000,
      sportType: "Cricket",
      description: "Learn cricket from experienced professionals"
    },
    {
      id: "2",
      name: "Basketball Training Program",
      bannerImageUrl: "/placeholder.svg?height=400&width=600",
      coachName: "Mike Johnson",
      durationWeeks: 8,
      price: 10000,
      sportType: "Basketball",
      description: "Comprehensive basketball training program"
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
    <div className="h-full flex gap-32 flex-col">
      <div className="flex gap-20 ">
        <div className="flex-1 my-32  mx-20">
          <h1 className="text-3xl font-semibold">
            <span className="text-5xl leading-normal">PlayBoxx</span> <br />{" "}
            Finding Box Sports for you!
          </h1>
          <p className="text-xl font-medium leading-relaxed">
            We connect you with nearby Box sports and match you with the Perfect
            team!
          </p>
          <div className="flex gap-2 mt-5 items-center">
            <div className="border bg-white shadow-xl flex justify-between gap-2 items-center border-slate-800 rounded px-1 py-0.5 ">
              <i className="fa-solid ml-1 fa-magnifying-glass"></i>
              <input
                className="outline-none bg-[#fff0]"
                type="text"
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search Your Location"
              />
            </div>
            <button  className="bg-[#FF6B35] text-white px-2 py-0.5 rounded font-medium">
              Search
            </button>
          </div>
          <div className="flex gap-10">
            <button className="bg-[#FF6B35] my-5 text-white font-medium px-3 py-1 rounded">
              Book Your Spot Now
            </button>
            <button className="bg-[#269475] my-5 text-white font-medium px-3 py-1 rounded">
              Contact us
            </button>
          </div>
        </div>
        <div className="flex-1 z-10 relative mt-14 ">
          <img
            src={cricket}
            className="h-56 z-10 hover:scale-[1.1] duration-500 absolute "
            alt=""
          />
          <img
            src={badminton}
            alt=""
            className="h-44 z-10 hover:scale-[1.1] duration-500 left-64 top-32 absolute"
          />
          <img
            src={basketball}
            alt=""
            className="h-48 z-10 hover:scale-[1.1] duration-500 left-10 bottom-0 absolute"
          />
        </div>
      </div>
      <div className="px-24">
        <h1 className="text-3xl font-semibold">Nearest Box Sports Places.</h1>
        <p className="text-">
          <i className="fa-solid text-[#269475] mr-2 fa-circle-dot"></i>
          {city ? city : ""}
        </p>
        <div className="grid mt-10 grid-cols-3 gap-10">
          {boxes?.length > 0
            ? boxes.map((e, i) => <BoxCard key={i} e={e} />)
            : null}
        </div>
      </div>
      <div className="px-24">
    <h1 className="text-3xl font-semibold">Upcoming Events</h1>
    <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegisterClick={(event) => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
        />
      ))}
    </div>
  </div>

  <div className="px-24">
    <h1 className="text-3xl font-semibold">Professional Coaching</h1>
    <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {coaching.map((program) => (
        <CoachingCard
          key={program.id}
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

      <div className="px-24 text-3xl font-semibold">
        <h1>Our Popular Sport Categories</h1>
        <div className="flex gap-10 mt-10">
          {data.categories.map((e, i) => (
            <div key={i} className="h-64 cursor-pointer w-44 rounded-lg">
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
      <div className="mx-24 flex flex-col items-center">
        <h1 className="text-4xl font-semibold my-1">Do You Own a Box?</h1>
        <p className="text-lg">Connect with Players and Fill Your Grounds</p>

        <div
          onClick={() => {
            Cookies.get("token") ? navigate("/boxregister") : navigate("/auth");
          }}
          className="bg-[#FF6B35] px-7 text-lg w-[300px] my-10 justify-center font-medium rounded-full py-1 gap-4 flex items-center text-white"
        >
          <button>Register Your Box Now</button>
          <i className="fa-solid  fa-arrow-right-long"></i>
        </div>
      </div>
      <div></div>
    </div>
  );
}

