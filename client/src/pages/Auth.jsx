import React, { useState } from "react";
import toast from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import axios, { Axios } from "axios";
import Cookies from "js-cookie";
import delay from "../utils/delay";
import { useNavigate } from "react-router-dom";
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
    <>
      <div className="flex py-20 items-center h-full">
        <div className="flex-[0.4] ml-20">
          <img
            className="rounded-xl "
            src="https://playo-website.gumlet.io/playo-website-v3/hero/hero_left.png"
            alt=""
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <label htmlFor="" className="text-2xl font-medium">
              Full Name
            </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Phone"
              value={name}
              className="px-2 border mb-3 border-slate-800 rounded py-1 w-[400px] outline-none"
            />
          </div>
          <div>
            <p className="text-2xl font-medium">Do you own a BOX?</p>
            <div className="flex gap-10">
              <label htmlFor="" className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name=""
                  checked={isOwner}
                  onChange={() => setIsOwner(true)}
                  id=""
                />
                Yes
              </label>
              <label htmlFor="" className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name=""
                  checked={!isOwner}
                  onChange={() => setIsOwner(false)}
                  id=""
                />
                No
              </label>
            </div>
          </div>
          <p className="text-2xl font-medium ">Phone</p>
          <div className="flex items-center mt-2 gap-10">
            <div className="flex rounded px-2 border border-slate-800 items-center bg-white w-[400px]">
              <p>91+</p>
              <input
                type="text"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                placeholder="Phone"
                className="px-2 py-1 w-full outline-none"
              />
            </div>
            <button
              onClick={handleGetOtp}
              className="bg-[#269475] text-white px-4 py-1 rounded"
            >
              Get Otp
            </button>
          </div>
          {showOtp ? (
            <div className="mt-2">
              <p>an OTP was sent to above mobile number.</p>
              <div className="flex my-1 gap-10">
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="outline-none border tracking-[5px] border-slate-700 rounded px-2 py-1"
                />
                <button
                  onClick={() => {
                    if (otp !== "12345") return toast.error("Invalid OTP");
                    else setOtpSuccess(true);
                  }}
                  className="bg-[#269475] text-white rounded font-medium px-3 py-1"
                >
                  {otpSuccess ? (
                    <i className="fa-regular text-white fa-circle-check"></i>
                  ) : (
                    "Verify Otp"
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
                className={`${
                  otpSuccess
                    ? "bg-[#FF6B35] cursor-pointer"
                    : "bg-[#ffa886] cursor-not-allowed "
                }  font-medium px-6 my-2 py-1 text-white rounded`}
              >
                Submit
              </button>
            </div>
          ) : null}

          <div className="flex gap-2 w-[200px]">
            <div className="border-b border-black flex-1"></div>
            <p className="flex-[0.1] text-center relative top-2 font-medium">
              or
            </p>
            <div className="flex-1 border-b border-black"></div>
          </div>
          <div>
            <button className="flex items-center my-3 mt-5 gap-2 text-sm font-medium justify-center bg-[#efefef] border border-[#3f3f3f58] rounded px-10 py-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                alt=""
                className="h-7 "
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
