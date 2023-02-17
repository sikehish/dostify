import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import logo from "../assets/home.png";
import home2 from "../assets/home-2.png";
import "../styles/Home.css";
import Footer from "../components/Footer";

function Home() {
  const { user } = useAuthContext;

  return (
    <>
      <div className="home-1">
        <div className="home-left">
          <h1>
            Welcome to <span>dostify.</span>
          </h1>
          <h3>Meet like minded people from the comfort of your home 🤟</h3>
          <button className="btn">
            <Link to={user ? "users" : "signup"} style={{ color: "black" }}>
              Get Started
            </Link>
          </button>
        </div>
        <div className="home-right">
          <img src={logo} alt="Expenses" />
        </div>
      </div>
      <div className="home-2">
        <div className="home-right">
          <img src={home2} alt="Expenses" />
        </div>
        <div className="home-left">
          <ul>
            <li>🤝 Befriend Like minded people</li>
            <li>🤝 Have one on one secure conversations with anyone.</li>
            <li>🤝 Chat with anyone over text using ChatRoom.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
