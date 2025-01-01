import React, { useState } from 'react';

export default function EventRegistrationModal({ isOpen, onClose, event }) {
  const [teamMembers, setTeamMembers] = useState([{ playerName: '', playerEmail: '', playerContact: '' }]);

  if (!isOpen) return null;

  const addTeamMember = () => {
    if (teamMembers.length < event.teamSize) {
      setTeamMembers([...teamMembers, { playerName: '', playerEmail: '', playerContact: '' }]);
    }
  };

  const updateTeamMember = (index, field, value) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index][field] = value;
    setTeamMembers(newTeamMembers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Register for {event?.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Name</label>
              <input 
                type="text" 
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Captain's Contact Number</label>
              <input 
                type="tel" 
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Team Members</h3>
              <p className="text-sm text-gray-500">
                {teamMembers.length} / {event?.teamSize} members
              </p>
            </div>

            {teamMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                    type="text"
                    value={member.playerName}
                    onChange={(e) => updateTeamMember(index, 'playerName', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email"
                    value={member.playerEmail}
                    onChange={(e) => updateTeamMember(index, 'playerEmail', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input 
                    type="tel"
                    value={member.playerContact}
                    onChange={(e) => updateTeamMember(index, 'playerContact', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                </div>
              </div>
            ))}

            {teamMembers.length < event?.teamSize && (
              <button
                type="button"
                onClick={addTeamMember}
                className="w-full py-2 px-4 border border-[#FF6B35] text-[#FF6B35] rounded-md hover:bg-[#FF6B35] hover:text-white transition-colors"
              >
                Add Team Member
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Registration Fee:</span>
              <span>₹{event?.pricePerTeam}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>₹{event?.pricePerTeam}</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] rounded-md hover:bg-[#ff6b35e0]"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

