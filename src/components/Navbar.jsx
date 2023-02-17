import { Link } from "react-router-dom";
import React from "react";
import "../styles/Navbar.css";
import logo from "../assets/faviconio-logo/logo.svg";
import useLogout from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout, isPending, error } = useLogout();
  const { user } = useAuthContext();

  return (
    <>
      <nav className="navbar">
        <div className="nav-img-div">
          <img src={logo} alt="dostify" />
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/users">Dosts</Link>
              <Link to="/video" target="_blank" rel="noopener noreferrer">
                Video Chat
              </Link>
              <a
                rel="noopener noreferrer"
                href="https://main--dostify-1.netlify.app/video"
                target="_blank"
              >
                Video Chat
              </a>
              <Link to="/chatroom/:id">Chat Room</Link>
              <Link to="/profile">Profile</Link>
              <div className="nav-logout">
                <span>Welcome,{user.displayName}!</span>
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
