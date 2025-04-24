// import React, { useCallback, useEffect, useState } from "react";
// import { useSocket } from "../provider/SocketProvider.jsx";
// import { usePeer } from "../provider/Peer.jsx";
// import ReactPlayer from 'react-player';

// function RoomPage() {
//   const { socket } = useSocket();
//   const { peer, createOffer, createAnswer, setRemoteAnswer,sendStream,remoteStream } = usePeer();
//   const [myStream, setMyStream] = useState(null);
//   // const [remoteStream, setRemoteStream] = useState(null);

//   if (!socket) {
//     return <div>Connecting to socket...</div>;
//   }

//   const handleNewUserJoined = useCallback(
//     async (data) => {
//       const { emailId } = data;
//       if (!emailId) {
//         console.error("Email ID is undefined in handleNewUserJoined");
//         return;
//       }
//       console.log(`New User ${emailId} Joined!`);
//       const offer = await createOffer();
//       socket.emit("call-user", { emailId, offer });
//       console.log(`calling user ${emailId} offering :${offer}`);
//     },
//     [createOffer, socket]
//   );

//   const handleIncomingCall = useCallback(
//     async (data) => {
//       const { fromEmail, offer } = data;

//       if (!fromEmail) {
//         console.error("fromEmail is undefined in handleIncomingCall");
//         return;
//       }

//       console.log(
//         `Incoming call from ${fromEmail} offering:`,
//         JSON.stringify(offer)
//       );
//       try {
//         const ans = await createAnswer(offer);
//         console.log("Answer created:", JSON.stringify(ans)); // Debugging
//         socket.emit("call-accepted", { emailId: fromEmail, ans });
//         console.log("call-accepted event emitted to:", fromEmail);
//       } catch (error) {
//         console.error("Error handling incoming call:", error);
//       }
//     },
//     [createAnswer, socket]
//   );

//   const handleAcceptedCall = useCallback(
//     async (data) => {
//       const { ans } = data;
//       console.log("Call accepted, setting remote answer:", JSON.stringify(ans)); // Debugging
//       try {
//         await setRemoteAnswer(ans);
//         console.log("Remote answer set successfully");
//         // sendStream(myStream)
//       } catch (error) {
//         console.error("Error setting remote answer:", error);
//       }
      
//     },
//     [setRemoteAnswer,sendStream,myStream]
//   );

//   useEffect(() => {
//     socket.on("user-joined", handleNewUserJoined);

//     return () => {
//       socket.off("user-joined", handleNewUserJoined);
//     };
//   }, [socket, handleNewUserJoined]);

//   useEffect(() => {
//     socket.on("incoming-call", async (data) => {
//       console.log("Incoming call event received:", JSON.stringify(data)); // Debugging
//       const { fromEmail, offer } = data;

//       if (!fromEmail) {
//         console.error("fromEmail is undefined in incoming-call event");
//         return;
//       }

//       console.log(`Incoming call from ${fromEmail} offering:`, offer);
//       await handleIncomingCall(data);
//     });

//     socket.on("call-accepted", async (data) => {
//       console.log("Call accepted event received:", JSON.stringify(data)); // Debugging
//       await handleAcceptedCall(data);
//     });

//     return () => {
//       socket.off("incoming-call");
//       socket.off("call-accepted");
//     };
//   }, [socket, handleIncomingCall, handleAcceptedCall]);

//   const getUserMediaStream = useCallback(async ()=> {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     // sendStream(stream);
//     setMyStream(stream);
//   },[])

//   useEffect(() => {
//     getUserMediaStream();
//   }, [getUserMediaStream]);
//   return (
//     <div className="RoomPage-container">
//       <h1>Room Page</h1>
//       <button onClick={()=>sendStream(myStream)}>Send My Stream</button>
//       <ReactPlayer url={myStream} playing muted/>
//       <ReactPlayer url={remoteStream} playing />
//     </div>
//   );
// }

// export default RoomPage;

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../provider/SocketProvider.jsx";
import { usePeer } from "../provider/Peer.jsx";

function RoomPage() {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  // Attach my stream to video tag
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // Attach remote stream to video tag
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleNewUserJoined = useCallback(async (data) => {
    const { emailId } = data;
    const offer = await createOffer();
    socket.emit("call-user", { emailId, offer });
  }, [createOffer, socket]);

  const handleIncomingCall = useCallback(async (data) => {
    const { fromEmail, offer } = data;
    const ans = await createAnswer(offer);
    socket.emit("call-accepted", { emailId: fromEmail, ans });
  }, [createAnswer, socket]);

  const handleAcceptedCall = useCallback(async (data) => {
    const { ans } = data;
    await setRemoteAnswer(ans);
  }, [setRemoteAnswer]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    return () => socket.off("user-joined", handleNewUserJoined);
  }, [socket, handleNewUserJoined]);

  useEffect(() => {
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleAcceptedCall);
    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleAcceptedCall);
    };
  }, [socket, handleIncomingCall, handleAcceptedCall]);

  return (
    <div className="RoomPage-container">
      <h1>Room Page</h1>

      <button onClick={() => sendStream(myStream)}>Send My Stream</button>
      <video
  ref={(video) => {
    if (video && myStream) video.srcObject = myStream;
  }}
  autoPlay
  muted
  playsInline
  style={{ width: "300px", border: "2px solid green" }}
/>

<video
  ref={(video) => {
    if (video && remoteStream) video.srcObject = remoteStream;
  }}
  autoPlay
  playsInline
  style={{ width: "300px", border: "2px solid red" }}
/>

    </div>
  );
}

export default RoomPage;
