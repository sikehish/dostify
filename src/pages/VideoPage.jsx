import { useEffect, useRef, useState } from "react";
import Videos from "../components/Videos";
import Menu from "../components/Menu";

import "../styles/App.css";

// Initialize WebRTC
// useEffect(() => {
//   const servers = {
//     iceServers: [
//       {
//         urls: [
//           "stun:stun1.l.google.com:19302",
//           "stun:stun2.l.google.com:19302",
//         ],
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   setPc(new RTCPeerConnection(servers));
// }, []);

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function VideoPage() {
  const [mode, setMode] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  const [pc, setPc] = useState(new RTCPeerConnection(servers));

  return (
    <div className="app">
      {mode === "home" ? (
        <Menu joinCode={joinCode} setJoinCode={setJoinCode} setMode={setMode} />
      ) : (
        <Videos mode={mode} callId={joinCode} setMode={setMode} pc={pc} />
      )}
    </div>
  );
}

export default VideoPage;
