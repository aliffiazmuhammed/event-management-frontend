import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  uploadexcelRoute,
  searchattendeeRoute,
  deleteattendeeRoute,
  editattendeeRoute,
  getsingleeventRoute,
  generatereportRoute,
  sendremaindermailsRoute,
  checkinattendee,
  addattendee,
} from "@/utils/apiRoutes";
import { useParams } from "react-router-dom";
import EmailSender from "@/components/admin-mailer";

function EventActionsPage({eventDetails}) {
  const [selectedValue, setSelectedValue] = useState("Name");
  const { eventId } = useParams();
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editAttendee, setEditAttendee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: "",
    email: "",
    morningGuestCount: 0,
    eveningGuestCount: 0,
    foodChoice: "",
    paymentAmount: 0,
  });
  
  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${searchattendeeRoute}/?type=${selectedValue}&query=${searchQuery}&eventId=${eventId}`
    );
    const data = await response.json();
    setSearchResult(data);
  };

  const handleFileUpload = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleFileSubmit = async () => {
    if (!excelFile) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("eventId", eventId); // Include the eventId in the form data

    // Send file to backend
    const response = await fetch(uploadexcelRoute, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully!");
      setExcelFile(null);
    } else {
      alert("Failed to upload file.");
    }
  };

  const handleDelete = async (attendeeId) => {
    const response = await fetch(`${deleteattendeeRoute}/${attendeeId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Attendee deleted successfully");
      setSearchResult(
        searchResult.filter((attendee) => attendee._id !== attendeeId)
      );
    } else {
      alert("Failed to delete attendee");
    }
  };

  const handleEdit = (attendee) => {
    setEditMode(true);
    setEditAttendee(attendee);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${editattendeeRoute}/${editAttendee._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editAttendee),
    });

    if (response.ok) {
      alert("Attendee details updated successfully");
      setEditMode(false);
      setSearchResult(
        searchResult.map((attendee) =>
          attendee._id === editAttendee._id ? editAttendee : attendee
        )
      );
    } else {
      alert("Failed to update attendee");
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch(
        `${generatereportRoute}/${eventId}`, // Replace with your backend route
        {
          method: "GET",
        }
      );

      if (response.ok) {
        // Create a blob for the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `${eventDetails.name}_Report.xlsx`; // File name
        a.click();

        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("An error occurred while generating the report.");
    }
  };

  const handleCheckIn = async (attendeeId) => {
    console.log("hello");
    const response = await fetch(`${checkinattendee}/${attendeeId}`, {
      method: "PUT",
    });

    if (response.ok) {
      alert("Attendee checked in successfully");
      setSearchResult(
        searchResult.map((attendee) =>
          attendee._id === attendeeId
            ? { ...attendee, checkIn: true }
            : attendee
        )
      );
    } else {
      console.log("failed");
      alert("Failed to check in attendee");
    }
  };


  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAttendee({ ...editAttendee, [name]: value });
  };
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Upload & Report Section */}
      <Card className="p-8 shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader className="mb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Manage Attendee Data
          </CardTitle>
          <p className="text-sm text-gray-500">
            Upload the attendee list and generate reports instantly.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Upload Attendee List
              </Label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={async (e) => {
                  await handleFileUpload(e);
                  handleFileSubmit();
                }}
                className="hover:cursor-pointer border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500">
                Accepted formats:{" "}
                <span className="font-medium">.xlsx, .xls</span>
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <Button
                onClick={generateReport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition-transform transform hover:scale-105"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card className="p-8 shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader className="mb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Search Attendees
          </CardTitle>
          <p className="text-sm text-gray-500">
            Find attendees by selecting a filter and entering a search term.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
            {/* Dropdown Menu */}
            <div className="flex flex-col">
              <Label className="text-gray-700 font-medium mb-2">
                Search By
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
                  >
                    {selectedValue}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem
                    onClick={() => handleSelect("Name")}
                    className="hover:bg-indigo-100"
                  >
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSelect("Email")}
                    className="hover:bg-indigo-100"
                  >
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Input */}
            <div className="flex flex-col">
              <Label className="text-gray-700 font-medium mb-2">Search</Label>
              <Input
                type="text"
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Search Button */}
            <div className="flex justify-end items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition-transform transform hover:scale-105"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Result Table */}
      {searchResult.length > 0 && (
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "Phone Number",
                      "Morning Guest",
                      "Evening Guest",
                      "Payment",
                      "Food Choice",
                      "Actions",
                    ].map((header) => (
                      <th key={header} className="border px-4 py-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((attendee, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{attendee.name}</td>
                      <td className="border px-4 py-2">{attendee.email}</td>
                      <td className="border px-4 py-2">{attendee.phone}</td>
                      <td className="border px-4 py-2">
                        {attendee.morningGuestCount}
                      </td>
                      <td className="border px-4 py-2">
                        {attendee.eveningGuestCount}
                      </td>
                      <td className="border px-4 py-2">
                        {attendee.paymentAmount}
                      </td>
                      <td className="border px-4 py-2">
                        {attendee.foodChoice}
                      </td>
                      <td className="border px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="outline">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEdit(attendee)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCheckIn(attendee._id)}
                            >
                              Check In
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(attendee._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      {editMode && (
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle>Edit Attendee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Event Name"
                  value={editAttendee.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editAttendee.email}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={editAttendee.phone}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="morningGuestCount">Morning Guest Count</Label>
                <Input
                  id="morningGuestCount"
                  name="morningGuestCount"
                  type="number"
                  value={editAttendee.morningGuestCount}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eveningGuestCount">Evening Guest Count</Label>
                <Input
                  id="eveningGuestCount"
                  name="eveningGuestCount"
                  type="number"
                  value={editAttendee.eveningGuestCount}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  value={editAttendee.paymentAmount}
                  onChange={handleEditChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="foodChoice">Food Choice</Label>
                <Input
                  id="foodChoice"
                  name="foodChoice"
                  type="text"
                  value={editAttendee.foodChoice}
                  onChange={handleEditChange}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <EmailSender />
    </div>
  );
}

export default EventActionsPage;
