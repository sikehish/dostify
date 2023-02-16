import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, timestamp } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false); //Used in cleanUp function
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      const { uid } = auth.currentUser;
      const createdAt = timestamp.fromDate(new Date());
      await updateDoc(doc(db, "users", uid), {
        online: false,
        lastActive: createdAt,
      });
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    setIsCancelled(false);
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { error, logout, isPending };
};

export default useLogout;
