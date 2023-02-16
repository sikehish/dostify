import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { useAuthContext } from "./hooks/useAuthContext";
import Footer from "./components/Footer";
import VideoPage from "./pages/VideoPage";
import OnlineUsers from "./pages/OnlineUsers";
import ChatRoom from "./pages/ChatRoom";
import EditProfile from "./pages/EditProfile";

export default function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/users"
              element={user ? <OnlineUsers /> : <Navigate to="/login" />}
            />
            <Route
              path="/video"
              element={user ? <VideoPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <EditProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/users" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/users" />}
            />
            <Route
              path="/chatroom/:id"
              element={!user ? <Navigate to="/login" /> : <ChatRoom />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}
