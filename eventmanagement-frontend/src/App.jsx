import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EventsDetailsPage from './pages/EventsDetailsPage';
import { LoginForm } from './components/user-login-page';
import UserLoginPage from './pages/UserLoginPage';
import UserPage from './pages/UserPage';
import UserEvent from './pages/UserEvent';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLoginPage />} />
          <Route path="/admindashboard/:adminId" element={<AdminDashboard />} />
          <Route
            path="/eventdetails/:eventId"
            element={<EventsDetailsPage />}
          />
          <Route path="/userlogin" element={<UserLoginPage />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/userevent/:eventId" element={<UserEvent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
