import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/config";
import "../styles/Menu.css";

export default function Menu({ joinCode, setJoinCode, setMode }) {
  const [error, setError] = useState(null);

  const onAnswer = async (e) => {
    const callDoc = doc(db, "calls", joinCode);
    let callData = await getDoc(callDoc);
    if (callData.exists()) setMode("join");
    else {
      setError("Invalid dostify meet code. Call Again");
    }
    console.log(error);
  };

  return (
    <div className="home">
      <div className="create box">
        <button onClick={() => setMode("create")}>Create Call</button>
      </div>

      <div className="answer box">
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Join with code"
        />
        <button onClick={onAnswer}>Answer</button>
        {error && <h4 className="code-error">{error}</h4>}
      </div>
    </div>
  );
}
