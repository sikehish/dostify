import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";
import { db, auth } from "../firebase/config";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import validator from "validator";
import { fetchSignInMethodsForEmail, updateProfile } from "firebase/auth";

function EditProfile() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [desc, setDesc] = useState("");
  const [data, setData] = useState("");
  const [succMsg, setSuccMsg] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    const documentRef = doc(db, "users", auth.currentUser.uid);
    try {
      if (desc.trim() == "") throw new Error("Description incomplete");
      if (name.trim() === "") throw new Error("Name cannot be empty");
      //   if (!validator.isEmail) throw new Error("Invalid Email");
      //   const checkEmail = await fetchSignInMethodsForEmail(auth, email);
      //   if (checkEmail.length) throw new Error("Email already in use");
      if (parseInt(age) < 0) throw new Error("Enter valid age");
      if (parseInt(age) < 12)
        throw new Error("You must be atleast 12 years old to sign up");
      if (!age) throw new Error("Enter valid age");
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      //   await updateEmail(auth.currentUser, email);
      await updateDoc(documentRef, {
        description: desc,
        age,
        name,
      });
      setSuccMsg("Successfully updated");
      setError(false);
      setIsPending(false);
    } catch (err) {
      setSuccMsg(false);
      setError(err);
      setIsPending(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      let docSnap = await getDoc(docRef);
      docSnap = docSnap.data();
      console.log(docSnap);
      setData(data);
      setDesc(docSnap.description);
      setAge(docSnap.age);
      setEmail(docSnap.email);
      setName(docSnap.name);
    };

    getData();

    // onSnapshot(doc(db, "users", auth.currentUser.uid))
  }, []);

  const textareaRef = useRef(null);

  const handleChange = (e) => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  //   useEffect(() => {
  //     if (isSucc) {
  //       setEmail("");
  //       setName("");
  //       setPw("");
  //       setCpw("");
  //       // setSuccMsg("Account created successfully!");
  //       const pathname = "/login";
  //       const myTimeout = setTimeout(() => {
  //         if (window.location.pathname == "/signup") navigate(pathname);
  //       }, 1500);
  //       if (window.location.pathname == pathname) clearTimeout(myTimeout);
  //     }
  //   }, [isSucc]);

  return (
    <>
      {
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Profile</h2>
          <h3>Email: {email}</h3>
          <label>
            <span>Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label></label>
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
            {isPending ? "Loading" : "Edit"}
          </button>
          {error && <p>{error.message}</p>}
          {succMsg && <p>{succMsg}</p>}
        </form>
      }
    </>
  );
}
export default EditProfile;
