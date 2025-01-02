import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CoachingCard({ coaching, onRegisterClick }) {
  const navigate = useNavigate();

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/coaching/${coaching.id}`);
  };

  return (
    <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
      <img
        src={coaching.bannerImageUrl || "/placeholder.svg?height=400&width=600"}
        alt={coaching.name}
        className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="absolute bottom-0 p-3 sm:p-4 w-full">
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{coaching.name}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-white/90">
              <p className="text-sm">Coach: {coaching.coachName}</p>
              <p className="text-sm">Duration: {coaching.durationWeeks} weeks</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegisterClick(coaching);
                }}
                className="flex-1 sm:flex-none bg-[#FF6B35] text-white px-3 sm:px-4 py-1.5 rounded hover:bg-[#ff6b35e0] transition-colors"
              >
                Register
              </button>
              <button
                onClick={handleDetailsClick}
                className="flex-1 sm:flex-none bg-[#269475] text-white px-3 sm:px-4 py-1.5 rounded hover:bg-[#269475e0] transition-colors"
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

