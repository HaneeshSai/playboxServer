import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BoxRegister from "./pages/BoxRegister";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="font-satoshi bg-[#F5F5F5]">
      <div className="">
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/boxregister" element={<BoxRegister />} />
        </Routes>
      </div>
    </div>
  );
}
