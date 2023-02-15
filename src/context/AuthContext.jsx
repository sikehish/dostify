import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { auth } from "../firebase/config";

export const AuthContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log(user);
      dispatch({ type: "AUTH_READY", payload: user });
    });
    unsub();
  }, []);

  console.log("Auth context", state);

  return (
    <AuthContext.Provider value={{ dispatch, ...state }}>
      {children}
    </AuthContext.Provider>
  );
};
