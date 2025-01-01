import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoachingRegistrationModal from '../components/CoachingRegistrationModal';

export default function CoachingDetails() {
  const { id } = useParams();
  const [coaching, setCoaching] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    // Fetch coaching details
    setCoaching({
      id,
      name: "Professional Cricket Coaching",
      description: "Learn cricket from experienced professionals",
      bannerImageUrl: "/placeholder.svg?height=400&width=800",
      coachName: "Rakshit Mishra",
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

  if (!coaching) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={coaching.bannerImageUrl}
          alt={coaching.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{coaching.name}</h1>
            <p className="text-white/90 text-lg">{coaching.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Program Details</h2>
              <p className="text-gray-600">{coaching.description}</p>
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Coach Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium">{coaching.coachName}</h3>
                    <p className="text-gray-600">{coaching.coachBio}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Program Highlights</h2>
              <ul className="grid grid-cols-2 gap-4">
                {coaching.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <i className="fa-solid fa-check text-[#269475]"></i>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Venue Details</h2>
              <div className="space-y-2">
                <p className="font-medium">{coaching.venue.placeName}</p>
                <p className="text-gray-600">{coaching.venue.fullAddress}</p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="text-center p-4 bg-[#269475] rounded-lg text-white">
                  <p className="text-sm uppercase">Program Fee</p>
                  <p className="text-3xl font-bold">₹{coaching.price}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{coaching.durationWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maximum Students</span>
                    <span className="font-medium">{coaching.maxStudents}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Schedule</h3>
                  {Object.entries(coaching.schedule).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize">{day}</span>
                      <span>{time}</span>
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

