import UserEventCard from "@/components/user-event-card";
import { userpageRoute } from "@/utils/apiRoutes";
import { useState, useEffect } from "react";

function UserPage() {
  const [liveEvents, setLiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const email = localStorage.getItem("userEmail"); // Assuming the user's email is saved in localStorage
        if (!email) {
          setError("User is not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${userpageRoute}?email=${email}`);
        const data = await response.json();

        if (data.success) {
          setLiveEvents(data.liveEvents);
          setUpcomingEvents(data.upcomingEvents);
          setCompletedEvents(data.completedEvents);
        } else {
          setError(data.message || "Failed to fetch events.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);


  return (
    <div className="user-page p-6 bg-gray-50 min-h-screen">
      <div className="content max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          My Events
        </h1>

        {/* Live Events Section */}
        {liveEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Live Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.map((event) => (
                <UserEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <UserEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Events Section */}
        {completedEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Completed Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map((event) => (
                <UserEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* No events found message */}
        {liveEvents.length === 0 &&
          upcomingEvents.length === 0 &&
          completedEvents.length === 0 && (
            <p className="text-lg text-gray-500 text-center">
              No events found.
            </p>
          )}
      </div>
    </div>
  );
}

export default UserPage;
