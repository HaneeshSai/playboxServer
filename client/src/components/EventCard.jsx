import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event, onRegisterClick }) {
  const navigate = useNavigate();

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg">
      <img
        src={event.bannerImageUrl || "/placeholder.svg?height=400&width=600"}
        alt={event.name}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white text-xl font-semibold mb-2">{event.name}</h3>
          <div className="flex justify-between items-center">
            <div className="text-white">
              <p className="text-sm">Prize Pool: ₹{event.prizeMoney}</p>
              <p className="text-sm">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegisterClick(event);
                }}
                className="bg-[#FF6B35] text-white px-4 py-1 rounded hover:bg-[#ff6b35e0]"
              >
                Register
              </button>
              <button
                onClick={handleDetailsClick}
                className="bg-[#269475] text-white px-4 py-1 rounded hover:bg-[#269475e0]"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

