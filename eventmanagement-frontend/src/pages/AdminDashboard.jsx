import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { addeventRoute, deleteeventRoute, geteventsRoute, updateeventRoute } from "@/utils/apiRoutes";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const { adminId } = useParams();

  useEffect(() => {
    fetch(geteventsRoute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId }),
    })
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const endpoint = editMode ? updateeventRoute : addeventRoute;
    const method = editMode ? "PUT" : "POST";
    const body = {
      ...eventForm,
      adminId,
      ...(editMode && { eventId: editingEventId }),
    };

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editMode) {
          setEvents((prev) =>
            prev.map((event) =>
              event._id === editingEventId ? { ...event, ...eventForm } : event
            )
          );
        } else {
          setEvents((prev) => [...prev, data.event]);
        }
        setEditMode(false);
        setEditingEventId(null);
        setEventForm({
          name: "",
          date: "",
          time: "",
          location: "",
        });
      })
      .catch((err) => console.error(err));
  };
 const handleDelete = (eventId) => {
   fetch(deleteeventRoute, {
     method: "DELETE",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ adminId, eventId }),
   })
     .then((res) => res.json())
     .then(() => {
       setEvents((prev) => prev.filter((event) => event._id !== eventId));
     })
     .catch((err) => console.error(err));
 };

 const handleEdit = (event) => {
   setEditMode(true);
   setEditingEventId(event._id);
   setEventForm({
     name: event.name,
     date: event.date.split("T")[0], // Format date
     time: event.time,
     location: event.location,
     description: event.description || "",
   });
 };

 const navigate = useNavigate(); // Initialize navigate hook

 const handleEventClick = (eventId) => {
   navigate(`/eventdetails/${eventId}`); // Navigate to EventDetails page with eventId
 };


  return (
    <div className="flex flex-col items-center p-8 space-y-2">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
        Admin Dashboard
      </h1>
      <Card className=" flex flex-col  w-full max-w-4xl px-4 sm:w-[900px]">
        <CardHeader>
          <CardTitle>{editMode ? "Edit Event" : "Add Event"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Event Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={eventForm.name}
                  onChange={handleChange}
                  placeholder="event name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Date</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  required
                  value={eventForm.date}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Time</Label>
                <Input
                  id="time"
                  type="time"
                  name="time"
                  required
                  value={eventForm.time}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Location</Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="location"
                  value={eventForm.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editMode ? "Update Event" : "Add Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="flex flex-col w-full max-w-4xl px-4 sm:w-[900px]">
        <CardHeader>
          <CardTitle>My Events</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            events.map((event) => (
              <Card>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div>
                    <p>Date:{event.date}</p>
                    <p>Time:{event.time}</p>
                    <p>Location:{event.location}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <Button
                      onClick={() => handleEdit(event)}
                      className="w-full sm:w-auto "
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleEventClick(event._id)}
                      className="w-full sm:w-auto"
                      variant="outline"
                      size="sm"
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => handleDelete(event._id)}
                      className="w-full sm:w-auto"
                      variant="outline"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
