import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import logo from "../assets/faviconio-logo/logo.png";
import {
  AiOutlineTwitter,
  AiOutlineInstagram,
  AiOutlineGithub,
  AiOutlineLinkedin,
} from "react-icons/ai";

function Footer() {
  return (
    <footer className="footer">
      <div className="upper">
        {/* <Link to="/">
          <img src={logo} alt="" />
        </Link> */}
        <div>
          <img src={logo} alt="" />
        </div>
        <div className="icons">
          <a
            href="https://twitter.com/sikehish"
            target="blank"
            rel="noopener noreferrer"
          >
            <AiOutlineTwitter />
          </a>
          <a
            href="https://instagram.com/sikehish"
            target="blank"
            rel="noopener noreferrer"
          >
            <AiOutlineInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/hisham-akmal-ba7455226/"
            target="blank"
            rel="noopener noreferrer"
          >
            <AiOutlineLinkedin />
          </a>
          <a
            href="https://github.com/sikehish"
            target="blank"
            rel="noopener noreferrer"
          >
            <AiOutlineGithub />
          </a>
        </div>
      </div>
      <div className="bottom-footer">
        {/* <p>Made with &#10084; by Hisham</p> */}
        <span>© Copyright 2022 dostify</span>
      </div>
    </footer>
  );
}

export default Footer;
