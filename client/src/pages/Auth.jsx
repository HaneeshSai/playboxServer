import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import delay from "../utils/delay";
import mainStore from "../store/mainStore";

export default function Auth() {
  const [showOtp, setShowOtp] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const { refreshNow } = mainStore();

  const handleGetOtp = async () => {
    if (name.length < 5)
      return toast.error("Your Name should be atleast 4 characters!");
    if (!/^\d{10}$/.test(phone)) return toast.error("Invalid Phone Number");

    setShowOtp(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}user/auth`,
        { name, phone, email: null, isOwner }
      );

      Cookies.set("token", response.data.token, { expires: 7 });
      toast.success(response.data.message);
      await delay(1000);
      refreshNow();
      if (isOwner) {
        if (response.data.existing) {
          navigate("/owner/portal");
        } else {
          navigate("/boxregister");
        }
      } else {
        if (Cookies.get("lastViewedBox")) {
          navigate(`/box/${Cookies.get("lastViewedBox")}`);
          return;
        }
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="lg:flex-[0.4] lg:pr-8 mb-8 lg:mb-0">
        <img
          className="rounded-xl w-full max-w-md mx-auto"
          src="https://playo-website.gumlet.io/playo-website-v3/hero/hero_left.png"
          alt="Sports"
        />
      </div>
      <div className="flex-1 max-w-xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="text-xl sm:text-2xl font-medium block">
              Full Name
            </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              value={name}
              className="px-3 py-2 border border-slate-800 rounded w-full outline-none mt-2"
            />
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-medium">Do you own a BOX?</p>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isOwner}
                  onChange={() => setIsOwner(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!isOwner}
                  onChange={() => setIsOwner(false)}
                />
                No
              </label>
            </div>
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-medium">Phone</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="flex-1 flex rounded px-3 py-2 border border-slate-800 items-center bg-white">
                <span className="text-gray-500 mr-2">+91</span>
                <input
                  type="text"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  placeholder="Enter your phone number"
                  className="w-full outline-none"
                />
              </div>
              <button
                onClick={handleGetOtp}
                className="bg-[#269475] text-white px-6 py-2 rounded hover:bg-[#269475]/90 transition-colors"
              >
                Get OTP
              </button>
            </div>
          </div>

          {showOtp && (
            <div className="space-y-4">
              <p>An OTP was sent to the above mobile number.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 outline-none border border-slate-700 rounded px-3 py-2 tracking-[5px]"
                />
                <button
                  onClick={() => {
                    if (otp !== "12345") return toast.error("Invalid OTP");
                    else setOtpSuccess(true);
                  }}
                  className="bg-[#269475] text-white rounded font-medium px-6 py-2 hover:bg-[#269475]/90 transition-colors"
                >
                  {otpSuccess ? (
                    <i className="fa-regular text-white fa-circle-check"></i>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
              {otpSuccess && (
                <p className="text-green-600 text-sm font-medium">
                  Please Submit your details to continue
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!otpSuccess}
                className={`w-full py-2 px-6 rounded font-medium transition-colors ${
                  otpSuccess
                    ? "bg-[#FF6B35] text-white cursor-pointer hover:bg-[#FF6B35]/90"
                    : "bg-[#ffa886] cursor-not-allowed text-white/70"
                }`}
              >
                Submit
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-b border-black"></div>
            <p className="text-sm font-medium">or</p>
            <div className="flex-1 border-b border-black"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-[#efefef] border border-[#3f3f3f58] rounded hover:bg-[#e5e5e5] transition-colors">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="h-6"
            />
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

