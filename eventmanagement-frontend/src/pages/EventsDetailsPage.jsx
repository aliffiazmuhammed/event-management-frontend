import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import EventActionsPage from "./EventActionsPage";
import { getsingleeventRoute } from "@/utils/apiRoutes";
import { useParams } from "react-router-dom";
import EventDetailCard from "@/components/event-detail-card";

function EventsDetailsPage() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({});
  const [eventStats, setEventStats] = useState({});
  const { eventId } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await fetch(`${getsingleeventRoute}/${eventId}`);
      const data = await response.json();
      setEventDetails(data.event);
      setEventStats(data.stats);
    };
    fetchEventDetails();
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-600 mb-6">
            {eventDetails.name}
          </h1>

          {/* Event Details Dropdown */}
          <div className="mb-6">
            <div
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="flex items-center justify-between px-5 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-md cursor-pointer transition-all shadow-sm"
            >
              <span className="text-lg font-semibold text-gray-800">
                Event Details
              </span>
              {isDetailsOpen ? (
                <ChevronUpIcon className="w-6 h-6 text-indigo-500" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-indigo-500" />
              )}
            </div>
            {isDetailsOpen && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <EventDetailCard
                  eventDetails={eventDetails}
                  eventstats={eventStats}
                />
              </div>
            )}
          </div>

          {/* Event Actions Dropdown */}
          <div>
            <div
              onClick={() => setIsActionOpen(!isActionOpen)}
              className="flex items-center justify-between px-5 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-md cursor-pointer transition-all shadow-sm"
            >
              <span className="text-lg font-semibold text-gray-800">
                Event Actions
              </span>
              {isActionOpen ? (
                <ChevronUpIcon className="w-6 h-6 text-indigo-500" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-indigo-500" />
              )}
            </div>
            {isActionOpen && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <EventActionsPage eventDetails={eventDetails} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsDetailsPage;
