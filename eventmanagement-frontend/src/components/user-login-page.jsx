import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sentotpRoute } from "@/utils/apiRoutes";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}) {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email and Phone Number are required!");
      return;
    }
    try {
      const response = await fetch(sentotpRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("userEmail", email);
        navigate(`/userpage`);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error loging in. Please try again.");
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Attendee Login</CardTitle>
          <CardDescription>
            Enter your email to search attendee list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  type="text"
                  required
                  name = "email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {message && <p>{message}</p>}
        </CardFooter>
      </Card>
    </div>
  );
}

