import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoachingRegistrationModal from '../components/CoachingRegistrationModal';

export default function CoachingDetails() {
  const { id } = useParams();
  const [coaching, setCoaching] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    // Fetch coaching details
    // This is a placeholder. Replace with actual API call
    setCoaching({
      id,
      name: "Professional Cricket Coaching",
      description: "Learn cricket from experienced professionals",
      bannerImageUrl: "/placeholder.svg?height=400&width=800",
      coachName: "John Smith",
      coachBio: "Former national player with 15 years of coaching experience",
      experienceYears: 15,
      durationWeeks: 12,
      price: 15000,
      maxStudents: 20,
      sportType: "Cricket",
      schedule: {
        monday: "6:00 AM - 8:00 AM",
        wednesday: "6:00 AM - 8:00 AM",
        friday: "6:00 AM - 8:00 AM"
      },
      highlights: [
        "Professional training methodology",
        "Video analysis sessions",
        "Fitness training",
        "Match practice"
      ],
      venue: {
        placeName: "Sports Complex",
        fullAddress: "123 Sports Avenue, City",
      }
    });
  }, [id]);

  if (!coaching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B35]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
        <img
          src={coaching.bannerImageUrl}
          alt={coaching.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{coaching.name}</h1>
            <p className="text-white/90 text-base sm:text-lg">{coaching.description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Program Details</h2>
              <p className="text-gray-600">{coaching.description}</p>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Coach Profile</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-medium">{coaching.coachName}</h3>
                    <p className="text-gray-600 mt-2">{coaching.coachBio}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Program Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {coaching.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-[#269475]"></i>
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Venue Details</h2>
              <div className="space-y-2">
                <p className="font-medium">{coaching.venue.placeName}</p>
                <p className="text-gray-600">{coaching.venue.fullAddress}</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="space-y-4">
                <div className="text-center p-4 bg-[#FF6B35] rounded-lg text-white">
                  <p className="text-sm uppercase font-medium">Program Fee</p>
                  <p className="text-2xl sm:text-3xl font-bold">₹{coaching.price.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{coaching.durationWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maximum Students</span>
                    <span className="font-medium">{coaching.maxStudents}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Schedule</h3>
                  {Object.entries(coaching.schedule).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm mb-2">
                      <span className="capitalize text-gray-600">{day}</span>
                      <span className="font-medium">{time}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-medium hover:bg-[#ff6b35e0] transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CoachingRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        coaching={coaching}
      />
    </div>
  );
}

