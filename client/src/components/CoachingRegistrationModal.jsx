import React from 'react';

export default function CoachingRegistrationModal({ isOpen, onClose, coaching }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Register for Coaching</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <input 
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input 
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input 
              type="tel"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
            <input 
              type="tel"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Medical Conditions (if any)</label>
            <textarea 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF6B35] focus:ring-[#FF6B35]"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Program Duration:</span>
              <span>{coaching?.durationWeeks} weeks</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>₹{coaching?.price}</span>
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

