import React from "react";

function EventDetailCard({ eventDetails, eventstats }) {
  return (
    <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-xl border border-gray-200 mt-4">
      {/* Header */}
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center gap-2">
        📅 Event Details
      </h2>

      {/* Event Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-600">Date</p>
          <p className="text-lg text-gray-800">
            {new Date(eventDetails.date).toLocaleDateString()}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-600">Time</p>
          <p className="text-lg text-gray-800">{eventDetails.time}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg shadow-sm col-span-1 sm:col-span-2">
          <p className="font-semibold text-gray-600">Location</p>
          <p className="text-lg text-gray-800">{eventDetails.location}</p>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          📊 Attendance Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg shadow-sm text-center">
            <p className="font-semibold text-gray-600">Checked-In</p>
            <p className="text-2xl font-bold text-purple-800">
              {eventstats.totalCheckedInAttendees}
            </p>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg shadow-sm text-center">
            <p className="font-semibold text-gray-600">Morning</p>
            <p className="text-2xl font-bold text-pink-800">
              {eventstats.totalMorningAttendees}
            </p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg shadow-sm text-center">
            <p className="font-semibold text-gray-600">Evening</p>
            <p className="text-2xl font-bold text-indigo-800">
              {eventstats.totalEveningAttendees}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailCard;
