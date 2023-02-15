import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
// import { collection, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import validator from "validator";
import { useState } from "react";

function useSignup() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isSucc, setIsSucc] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false); //Used in cleanUp function

  const signup = async (name, email, password, cpassword) => {
    setError(null);
    setIsSucc(false);
    setIsPending(true);
    try {
      if (name.trim() === "") throw new Error("Name left empty");
      if (!validator.isEmail) throw new Error("Invalid Email");
      if (password !== cpassword) throw new Error("Password not matching");
      if (password.length < 6)
        throw new Error("Password should have atleast 6 characters");

      const checkEmail = await fetchSignInMethodsForEmail(auth, email);
      if (checkEmail.length) throw new Error("Email already in use");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) throw new Error("Signup failed:(");
      console.log(res.user);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      if (!isCancelled) {
        setError(false);
        setIsPending(false);
        setIsSucc("Account created successfully");
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err);
        setIsPending(false);
        setIsSucc(false);
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { signup, isPending, error, isSucc };
}

export default useSignup;
