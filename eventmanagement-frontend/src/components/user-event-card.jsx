import React from 'react'
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

function UserEventCard({ event }) {


    const navigate = useNavigate()
  const { name, date, time, location } = event;
  // Function to format time to 12-hour format with AM/PM
  const formatTime = (time) => {
    // Check if the time is already in a valid format (HH:mm or HH:mm:ss)
    const date = new Date(`1970-01-01T${time}Z`); // Use a fixed date to avoid invalid date issues

    if (isNaN(date.getTime())) {
      return "Invalid time"; // Handle invalid time
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert to 12-hour format, handle 12:00 noon
    const minute = minutes < 10 ? `0${minutes}` : minutes;

    return `${hour12}:${minute} ${ampm}`;
  };
const handleEventdetails = () => {
    navigate(`/userevent/${event._id}`);
}

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="p-6">
        {/* Event Name */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>

        {/* Event Date, Time, and Location */}
        <p className="text-sm text-gray-600 mb-2">
          <strong>Date:</strong>{" "}
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(date))}
        </p>

        <p className="text-sm text-gray-600 mb-2">
          <strong>Time:</strong> {formatTime(time)}
        </p>

        <p className="text-sm text-gray-600 mb-4">
          <strong>Location:</strong> {location}
        </p>

        {/* Action Button (Optional, if you want interactivity) */}
        <Button variant="outline" color="primary" className="mt-4" onClick={handleEventdetails}>
          View Event Details
        </Button>
      </div>
    </div>
  );
}

export default UserEventCard
