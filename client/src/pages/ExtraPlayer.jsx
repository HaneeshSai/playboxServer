import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ExtraPlayer() {
  const { id } = useParams();

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}user/handleextraplayerpayment`,
        {
          extraPlayerId: id,
        }
      );
      // console.log(response);
      toast.success(response?.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="w-full flex h-screen flex-col my-10 items-center">
      <p>Payment</p>
      <button
        onClick={handlePayment}
        className="px-5 py-0.5 rounded bg-orange-500 text-white"
      >
        Make Payment
      </button>
    </div>
  );
}
