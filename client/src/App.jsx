import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BoxRegister from "./pages/BoxRegister";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/auth";
import Cookies from "js-cookie";
import mainStore from "./store/mainStore";
import OwnerPortal from "./pages/OwnerPortal";

export default function App() {
  return (
    <div className="font-satoshi h-full bg-[#F5F5F5]">
      <div className="">
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/boxregister" element={<BoxRegister />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/owner/portal" element={<OwnerPortal />} />
        </Routes>
      </div>
    </div>
  );
}
