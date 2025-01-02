import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import mainStore from "../store/mainStore";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { refresh } = mainStore();
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.get("token") ? setLoggedIn(true) : setLoggedIn(false);
  }, [refresh]);

  useEffect(() => {
    // Prevent scrolling when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="sticky z-50 top-0">
      {/* Navbar */}
      <div className="backdrop-blur-xl bg-white/80 shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1
                onClick={() => navigate("/")}
                className="text-2xl sm:text-3xl cursor-pointer font-semibold text-[#FF6B35]"
              >
                PlayBoxx
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="bg-[#269475] px-3 py-1.5 rounded text-white hover:bg-[#269475]/90 transition-colors"
              >
                Book a spot
              </Link>
              <Link to="/findspot" className="hover:text-[#FF6B35] transition-colors">
                Find your sport
              </Link>
              <Link to="/" className="hover:text-[#FF6B35] transition-colors">
                About
              </Link>
              <Link to="/" className="hover:text-[#FF6B35] transition-colors">
                Join Us
              </Link>
              <Link to="/" className="hover:text-[#FF6B35] transition-colors">
                Contact
              </Link>
              {loggedIn ? (
                <div
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:text-[#FF6B35] transition-colors"
                >
                  <i className="fa-solid fa-user"></i>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-[#FF6B35] text-white px-4 py-1.5 rounded hover:bg-[#FF6B35]/90 transition-colors"
                >
                  Login/Signup
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#FF6B35] focus:outline-none"
                aria-expanded="false"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - Slide from right */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white/90 backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#FF6B35]">Menu</h2>
              <button
                onClick={closeMenu}
                className="rounded-md text-gray-700 hover:text-[#FF6B35] focus:outline-none"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-2 py-4 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className="w-full text-left px-4 py-3 text-base font-medium hover:bg-[#269475] hover:text-white rounded-lg transition-colors"
            >
              Book a spot
            </button>
            <button
              onClick={() => handleNavigation("/findspot")}
              className="w-full text-left px-4 py-3 text-base font-medium hover:bg-[#269475] hover:text-white rounded-lg transition-colors"
            >
              Find your sport
            </button>
            <button
              onClick={() => handleNavigation("/")}
              className="w-full text-left px-4 py-3 text-base font-medium hover:bg-[#269475] hover:text-white rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("/")}
              className="w-full text-left px-4 py-3 text-base font-medium hover:bg-[#269475] hover:text-white rounded-lg transition-colors"
            >
              Join Us
            </button>
            <button
              onClick={() => handleNavigation("/")}
              className="w-full text-left px-4 py-3 text-base font-medium hover:bg-[#269475] hover:text-white rounded-lg transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Auth Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white/50 backdrop-blur-sm">
            {loggedIn ? (
              <button
                onClick={() => handleNavigation("/profile")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
              >
                <i className="fa-solid fa-user"></i>
                View Profile
              </button>
            ) : (
              <button
                onClick={() => handleNavigation("/auth")}
                className="w-full px-4 py-3 text-base font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
              >
                Login/Signup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

