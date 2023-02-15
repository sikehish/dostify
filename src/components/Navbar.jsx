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
              <Link to="/expenses">Expenses</Link>
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
