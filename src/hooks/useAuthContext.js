import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const val = useContext(AuthContext);
  if (!val) {
    throw new Error("useAuthContext must be used inside AuthContextProvider");
  }
  return val;
};
