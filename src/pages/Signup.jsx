import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
// import "../styles/Login.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [cpw, setCpw] = useState("");
  const [age, setAge] = useState("");
  const [desc, setDesc] = useState("");
  const { signup, error, isPending, isSucc } = useSignup();
  // const [succMsg, setSuccMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(name, email, pw, cpw, age, desc);
    // if (!error) navigate("/");
  };
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  useEffect(() => {
    if (isSucc) {
      setEmail("");
      setName("");
      setPw("");
      setCpw("");
      // setSuccMsg("Account created successfully!");
      const pathname = "/login";
      const myTimeout = setTimeout(() => {
        if (window.location.pathname == "/signup") navigate(pathname);
      }, 1500);
      if (window.location.pathname == pathname) clearTimeout(myTimeout);
    }
  }, [isSucc]);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Signup</h2>
      <label>
        <span>Name:</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        <span>Email:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </label>
      <label>
        <span>Confirm Password:</span>
        <input
          type="password"
          value={cpw}
          onChange={(e) => setCpw(e.target.value)}
        />
      </label>
      <label>
        <span>Age:</span>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </label>
      <label>
        <span>Description:</span>
        <textarea
          name=""
          id=""
          cols={50}
          value={desc}
          placeholder="Description"
          ref={textareaRef}
          onChange={(e) => {
            setDesc(e.target.value);
            handleChange(e);
          }}
          className="textarea"
        ></textarea>
      </label>
      {/* {!isPending && <button className="btn">Signup</button>}
      {isPending && <button className="btn" disabled>Loading</button>} */}
      <button className="btn" disabled={isPending}>
        {isPending ? "Loading" : "Signup"}
      </button>
      {error && <p>{error}</p>}
      {isSucc && <p>{isSucc}</p>}
    </form>
  );
}
export default Signup;
