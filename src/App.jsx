import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { useAuthContext } from "./hooks/useAuthContext";
import Footer from "./components/Footer";
import VideoPage from "./VideoPage";

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
              path="/video"
              element={user ? <VideoPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/video" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/video" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </div>
  );
}
