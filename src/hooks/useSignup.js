import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
// import { collection, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import validator from "validator";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { doc, setDoc } from "firebase/firestore";

function useSignup() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isSucc, setIsSucc] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false); //Used in cleanUp function

  const { dispatch } = useAuthContext();

  const signup = async (name, email, password, cpassword, age, desc) => {
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
      if (parseInt(age) < 0) throw new Error("Enter valid age");
      if (parseInt(age) < 12)
        throw new Error("You must be atleast 12 years old to sign up");
      if (!age || !desc.trim())
        throw new Error("All fields are required. Fill them accordingly");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) throw new Error("Signup failed:(");
      console.log(res.user);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      // const createdAt = timestamp.fromDate(new Date());
      await setDoc(doc(db, "users", res.user.uid), {
        online: true,
        name,
        email,
        description: desc,
        age,
        // lastLogin: createdAt,
        lastActive: null,
      });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

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
