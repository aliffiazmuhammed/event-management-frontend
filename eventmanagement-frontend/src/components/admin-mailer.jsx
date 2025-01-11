import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; 

const EmailSender = () => {
  const [emailContent, setEmailContent] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    if (!subject || !emailContent) {
      setMessage("Please enter both subject and content.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/send-email", {
        subject,
        content: emailContent,
      });
      setMessage("Emails sent successfully!");
      setEmailContent("");
      setSubject("");
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("Failed to send emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Send Email to All Attendees</h2>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <Textarea
          rows="10"
          placeholder="Enter email content here..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="resize-none"
        />

        <Button
          onClick={handleSendEmail}
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send Email"}
        </Button>

        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmailSender;
