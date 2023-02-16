import { auth, db } from "../firebase/config";
import {
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
// import { collection, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import validator from "validator";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { doc, updateDoc } from "firebase/firestore";

function useLogin() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isSucc, setIsSucc] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false); //Used in cleanUp function
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsSucc(false);
    setIsPending(true);
    try {
      if (!validator.isEmail) throw new Error("Invalid Email");
      const checkEmail = await fetchSignInMethodsForEmail(auth, email);
      if (!checkEmail.length) throw new Error("Email not registered");
      const res = await signInWithEmailAndPassword(auth, email, password);
      const documentRef = doc(db, "users", res.user.uid);
      // const createdAt = timestamp.fromDate(new Date());
      await updateDoc(documentRef, {
        online: true,
        lastActive: null /*lastLogin: createdAt*/,
      });

      dispatch({ type: "LOGIN", payload: res.user });
      // if (!res) throw new Error("Invalid password");
      console.log(res.user);
      if (!isCancelled) {
        setError(false);
        setIsPending(false);
        setIsSucc("Logged In successfully");
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(JSON.stringify(err));
        setIsPending(false);
        setIsSucc(false);
        if (err.code == "auth/wrong-password") setError("Incorrect password");
        else setError(err.message);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { login, isPending, error, isSucc };
}

export default useLogin;
