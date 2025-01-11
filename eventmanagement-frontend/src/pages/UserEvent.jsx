import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { fetchUserDetailsRoute, usereventcheckinRoute, usereventregisterRoute, usereventregistrationstatusRoute, usereventRoute, userupdateguestRoute } from "@/utils/apiRoutes";

const UserEvent = () => {
  const { eventId } = useParams(); // Get the eventId from the URL
  const [eventDetails, setEventDetails] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [userDetails, setUserDetails] = useState({
    _id: "",
    name: "",
    phone: "",
    email: "",
    paymentStatus: "Pending", // Default value
    morningGuestCount: 0,
    eveningGuestCount: 0,
    foodChoice: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch event details and registration status on load
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`${usereventRoute}/${eventId}`);

        const userEmail =
          userDetails.email || localStorage.getItem("userEmail"); // Get user email from localStorage or state

        const registrationResponse = await axios.get(
          `${usereventregistrationstatusRoute}/${eventId}`,
          {
            params: { email: userEmail }, // Pass email as a query parameter
          }
        );

        const userResponse = await axios.get(`${fetchUserDetailsRoute}`, {
          params: { email: userEmail, eventId },
        });
        console.log(userResponse.data);

        setEventDetails(eventResponse.data.event);
        setRegistrationStatus(registrationResponse.data);
        setUserDetails(userResponse.data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setMessage("Failed to load event details. Please try again.");
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, userDetails.email]);

  // Handle guest count update
  const handleGuestCountUpdate = async () => {
    try {
      const response = await axios.put(`${userupdateguestRoute}/${eventId}`, {
        email: userDetails.email, // Email to identify the user
        morningGuestCount: userDetails.morningGuestCount,
        eveningGuestCount: userDetails.eveningGuestCount,
        foodChoice: userDetails.foodChoice,
      });
      setMessage(response.data.message);
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating guest count:", error);
      setMessage("Failed to update guest count. Please try again.");
    }
  };

  // Handle user registration
  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${usereventregisterRoute}/${eventId}`,
        {
          email: userDetails.email, // Email to identify the user
          name: userDetails.name, // User's name
          phone: userDetails.phone, // User's phone
          eventname: eventDetails.name,
          eventlocation: eventDetails.location,
          eventDate: eventDetails.date,
        }
      );
      setMessage(response.data.message);
      setRegistrationStatus({ ...registrationStatus, registered: true });
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Failed to register. Please try again.");
    }
  };

  // Handle user check-in
  const handleCheckIn = async () => {
    try {
      const response = await axios.post(`${usereventcheckinRoute}/${eventId}`, {
        email: userDetails.email, // Email to identify the user
      });
      setMessage(response.data.message);
      setRegistrationStatus({ ...registrationStatus, checkedIn: true });
    } catch (error) {
      console.error("Error during check-in:", error);
      setMessage("Failed to check in. Please try again.");
    }
  };

  // Display loading message if data is being fetched
  if (isLoading) {
    return <p className="text-center text-lg text-gray-500">Loading...</p>;
  }

  // Display error message if event details are not found
  if (!eventDetails) {
    return (
      <p className="text-center text-lg text-gray-500">
        {message || "Event not found."}
      </p>
    );
  }

  // Format dates for easier comparison
  const currentDate = new Date();
  const eventDate = new Date(eventDetails.date);

  return (
    <div className="user-event-page px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {eventDetails.name}
        </h2>
        <p className="text-lg text-gray-700 mt-2">{eventDetails.description}</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(eventDetails.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Location:</strong> {eventDetails.location}
          </p>
        </div>

        <hr className="my-6" />

        <h3 className="text-2xl font-semibold text-gray-800">User Details</h3>
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.phone}
              </p>
              <p>
                <strong>Payment Amount:</strong> {userDetails.paymentAmount}
              </p>
            </div>

            <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
              <strong>Guest Count:</strong>
              <div className="mt-2">
                {!isEditing ? (
                  <>
                    <div>Morning: {userDetails.morningGuestCount}</div>
                    <div>Evening: {userDetails.eveningGuestCount}</div>
                    <div>
                      <strong>Food Choice:</strong> {userDetails.foodChoice}
                    </div>
                    <button
                      className="mt-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Morning Guests
                        </label>
                        <Input
                          type="number"
                          value={userDetails.morningGuestCount}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              morningGuestCount: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Evening Guests
                        </label>
                        <Input
                          type="number"
                          value={userDetails.eveningGuestCount}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              eveningGuestCount: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Food Choice
                      </label>
                      <Input
                        type="text"
                        value={userDetails.foodChoice}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            foodChoice: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button
                        onClick={handleGuestCountUpdate}
                        className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Registration and Check-In Status */}
          <div className="mt-6 text-center">
            {message && <p className="text-lg text-gray-500">{message}</p>}
            {!message && registrationStatus?.registered && (
              <p className="text-lg text-green-600">
                You are already registered!
              </p>
            )}
            {!message && registrationStatus?.checkedIn && (
              <p className="text-lg text-yellow-600">
                You have already checked in!
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-6">
          {currentDate < eventDate && !registrationStatus?.registered && (
            <Button
              onClick={handleRegister}
              className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
            >
              Register
            </Button>
          )}

          {currentDate.toDateString() === eventDate.toDateString() &&
            registrationStatus?.registered &&
            !registrationStatus?.checkedIn && (
              <Button
                onClick={handleCheckIn}
                className="w-full sm:w-auto bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Check In
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserEvent;
