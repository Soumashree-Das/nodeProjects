import React, { useCallback, useEffect } from "react";
import { useSocket } from "../provider/SocketProvider.jsx";
import { usePeer } from "../provider/Peer.jsx";

function RoomPage() {
  const { socket } = useSocket();
  const { peer, createOffer,createAnswer ,setRemoteAnswer} = usePeer();

  if (!socket) {
    return <div>Connecting to socket...</div>;
  }

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      if (!emailId) {
        console.error("Email ID is undefined in handleNewUserJoined");
        return;
      }
      console.log(`New User ${emailId} Joined!`);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      console.log(`calling user ${emailId} offering :${offer}`);
      
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const {fromEmail, offer } = data;

      if (!fromEmail) {
        console.error("fromEmail is undefined in handleIncomingCall");
        return;
      }

      console.log(`Incoming call from ${fromEmail} offering:`, JSON.stringify(offer));
      try {
        const ans = await createAnswer(offer);
        console.log("Answer created:", JSON.stringify(ans)); // Debugging
        socket.emit("call-accepted", { emailId:fromEmail,ans });
        console.log("call-accepted event emitted to:", fromEmail);
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [createAnswer, socket]
  );

  const handleAcceptedCall = useCallback(async (data) => {
    const { ans } = data;
    console.log("Call accepted, setting remote answer:", JSON.stringify(ans)); // Debugging 
    try {
      await setRemoteAnswer(ans);
      console.log("Remote answer set successfully");
    } catch (error) {
      console.error("Error setting remote answer:", error);
    }
  }, [setRemoteAnswer]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
    };
  }, [socket, handleNewUserJoined]);

  useEffect(() => {
    socket.on("incoming-call", async (data) => {
      console.log("Incoming call event received:", JSON.stringify(data)); // Debugging
      const { fromEmail, offer } = data;

    if (!fromEmail) {
      console.error("fromEmail is undefined in incoming-call event");
      return;
    }

    console.log(`Incoming call from ${fromEmail} offering:`, offer);
      await handleIncomingCall(data);
    });

    socket.on("call-accepted", async (data) => {
      console.log("Call accepted event received:", JSON.stringify(data)); // Debugging
      await handleAcceptedCall(data);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
    };
  }, [socket, handleIncomingCall, handleAcceptedCall]);

  return (
    <div className="RoomPage-container">
      <h1>Room Page</h1>
    </div>
  );
}

export default RoomPage;
