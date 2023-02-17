import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const { login, error, isPending, isSucc } = useLogin();
  // const [succMsg, setSuccMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, pw);
    // if (!error) navigate("/");
  };

  useEffect(() => {
    if (isSucc) {
      setEmail("");
      setPw("");
      const pathname = "/";
      const myTimeout = setTimeout(() => {
        if (window.location.pathname == "/login") navigate(pathname);
      }, 1500);
      if (window.location.pathname == pathname) clearTimeout(myTimeout);
    }
  }, [isSucc]);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
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
      <button className="btn" disabled={isPending}>
        {isPending ? "Loading" : "Login"}
      </button>
      {error && <p className="code-error">{error}</p>}
      {isSucc && <p className="succ">{isSucc}</p>}
    </form>
  );
}
export default Login;
