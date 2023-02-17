import { useRef, useState, useEffect } from "react";
import { ReactComponent as HangupIcon } from "../assets/disconnect.svg";
import { ReactComponent as MoreIcon } from "../assets/vertical.svg";
import { ReactComponent as CopyIcon } from "../assets/copy.svg";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillMicFill,
  BsMicMuteFill,
} from "react-icons/bs";

import { db, auth } from "../firebase/config";
import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  collection,
  setDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

export default function Videos({ mode, callId, setMode, pc }) {
  //   useEffect(() => {
  //     return () => {
  //       hangUp();
  //     };
  //   }, []);

  const [webcamActive, setWebcamActive] = useState(false);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState(callId);
  const [clicked, setClicked] = useState(false);
  const [locStream, setLocStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const localRef = useRef();
  const remoteRef = useRef();

  const setupSources = async () => {
    setError(false);
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    localRef.current.srcObject = localStream;
    setLocStream(localStream);
    // console.log(localRef, localRef.current, remoteRef);
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    // console.log("uooo");
    if (mode === "create") {
      const callDoc = doc(collection(db, "calls"));
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      setRoomId(callDoc.id);

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
      };
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (mode === "join") {
      const callDoc = doc(db, "calls", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
      };

      try {
        let callData = await getDoc(callDoc);
        if (callData.exists()) callData = callData.data();
        else {
          setError("Invalid dostify meet code. Call Again");
          hangUp();
        }
        // console.log(callId, callData);
        const offerDescription = callData.offer;
        await pc.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
        );
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };

        await updateDoc(callDoc, { answer });

        onSnapshot(offerCandidates, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
  };

  const hangUp = async () => {
    pc.close();

    if (roomId) {
      let roomRef = doc(db, "calls", roomId);
      const cref = collection(roomRef, "answerCandidates");
      await getDocs(cref).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      });
      await getDocs(collection(roomRef, "offerCandidates")).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
        }
      );

      await deleteDoc(roomRef);
    }

    window.location.reload();
  };

  return (
    <div className="videos">
      {/* <h4>Local</h4> */}
      {error && <h3 className="code-error">{error}</h3>}
      <div className="vid-flex">
        <p>
          <h4>You</h4>
          <video ref={localRef} autoPlay playsInline className="local" muted />
        </p>
        <p>
          <h4>Your Dost</h4>
          <video ref={remoteRef} autoPlay playsInline className="remote" />
        </p>
      </div>

      <div className="buttonsContainer">
        <button
          onClick={hangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          <HangupIcon />
        </button>
        <button
          onClick={(e) => {
            setAudioEnabled((prev) => !prev);
            locStream.getAudioTracks()[0].enabled =
              !locStream.getAudioTracks()[0].enabled;
          }}
          disabled={!webcamActive}
          style={{ background: "none", color: "red" }}
        >
          {audioEnabled ? <BsMicMuteFill /> : <BsFillMicFill />}
        </button>
        <button
          onClick={(e) => {
            setVideoEnabled((prev) => !prev);
            locStream.getVideoTracks()[0].enabled =
              !locStream.getVideoTracks()[0].enabled;
          }}
          style={{ background: "none", color: "red" }}
          disabled={!webcamActive}
        >
          {videoEnabled ? (
            <BsFillCameraVideoOffFill />
          ) : (
            <BsFillCameraVideoFill />
          )}
        </button>
        <div tabIndex={0} role="button" className="more button">
          <MoreIcon />
          <div className="popover">
            <button
              onClick={() => {
                setClicked(true);
                navigator.clipboard
                  .writeText(roomId)
                  .then(() => {
                    console.log(roomId);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              {clicked ? <span>Copied!</span> : <CopyIcon />}
            </button>
          </div>
        </div>
      </div>

      {!webcamActive && (
        <div className="modalContainer">
          <div className="modal">
            <h3>Turn on your camera and microphone and start the call</h3>
            <div className="container">
              <button onClick={() => setMode("home")} className="secondary">
                Cancel
              </button>
              <button onClick={setupSources}>Start</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
