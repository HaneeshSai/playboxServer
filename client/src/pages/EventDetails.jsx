import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventRegistrationModal from '../components/EventRegistrationModal';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    // Fetch event details
    setEvent({
      id,
      name: "Cricket Tournament 2024",
      description: "Join us for the biggest cricket tournament of the year!",
      bannerImageUrl: "/placeholder.svg?height=400&width=800",
      prizeMoney: 50000,
      eventDate: "2024-02-15",
      registrationDeadline: "2024-02-10",
      maxTeams: 16,
      teamSize: 11,
      pricePerTeam: 2000,
      sportType: "Cricket",
      rules: [
        "Teams must arrive 30 minutes before their scheduled match",
        "Each team must have at least 11 players",
        "Tournament will follow ICC rules",
      ],
      venue: {
        placeName: "Sports Complex",
        fullAddress: "123 Sports Avenue, City",
      }
    });
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={event.bannerImageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
            <p className="text-white/90 text-lg">{event.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
              <p className="text-gray-600">{event.description}</p>
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Tournament Rules</h2>
              <ul className="list-disc pl-5 space-y-2">
                {event.rules.map((rule, index) => (
                  <li key={index} className="text-gray-600">{rule}</li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Venue Details</h2>
              <div className="space-y-2">
                <p className="font-medium">{event.venue.placeName}</p>
                <p className="text-gray-600">{event.venue.fullAddress}</p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="text-center p-4 bg-[#269475] rounded-lg text-white">
                  <p className="text-sm uppercase">Prize Pool</p>
                  <p className="text-3xl font-bold">₹{event.prizeMoney}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Deadline</span>
                    <span className="font-medium">{new Date(event.registrationDeadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-medium">{event.teamSize} players</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maximum Teams</span>
                    <span className="font-medium">{event.maxTeams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Fee</span>
                    <span className="font-medium">₹{event.pricePerTeam}</span>
                  </div>
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

      <EventRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        event={event}
      />
    </div>
  );
}
