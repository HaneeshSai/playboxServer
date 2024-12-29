import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BoxRegister from "./pages/BoxRegister";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import Cookies from "js-cookie";
import mainStore from "./store/mainStore";
import OwnerPortal from "./pages/OwnerPortal";
import Box from "./pages/Box";
import Booking from "./pages/Booking";
import BookingDetailsModal from "./components/BookingDetailsModal";
import Payment from "./pages/Payment";
import ExtraPlayer from "./pages/ExtraPlayer";
import Profile from "./pages/Profile";
import FindSpot from "./pages/FindSpot";

export default function App() {
  const { city, setCity, showBookingModal } = mainStore();

  useEffect(() => {
    const fetchCity = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();
        if (data.address && data.address.city) {
          setCity(data.address.city);
        } else if (data.address && data.address.town) {
          setCity(data.address.town);
        } else if (data.address && data.address.village) {
          setCity(data.address.village);
        } else {
          console.log("City not found");
        }
      } catch (err) {
        console.log("Failed to fetch city");
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchCity(latitude, longitude);
          },
          (err) => {
            console.log("Location permission denied");
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser");
      }
    };

    // getLocation();
    setCity("Hyderabad");
  }, []);

  return (
    <div className="font-satoshi h-full bg-[#F5F5F5]">
      <div className="">
        {showBookingModal ? <BookingDetailsModal /> : null}
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/boxregister" element={<BoxRegister />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/owner/portal" element={<OwnerPortal />} />
          <Route path="/box/:id" element={<Box />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/extraplayerspayment/:id" element={<ExtraPlayer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/findspot" element={<FindSpot />} />
        </Routes>
      </div>
    </div>
  );
}
