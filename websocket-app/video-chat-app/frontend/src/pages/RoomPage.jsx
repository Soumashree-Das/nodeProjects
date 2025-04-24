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
      console.log(`New User ${emailId} Joined!`);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      console.log(`calling user ${emailId} offering :${offer}`);
      
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { fromEmail, offer } = data;
      console.log(`Incoming call from ${fromEmail} offering:`, offer);
      try {
        const ans = await createAnswer(offer);
        console.log("Answer created:", ans); // Debugging
        socket.emit("call-accepted", { ans });
        console.log("call-accepted event emitted to:", fromEmail);
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [createAnswer, socket]
  );

  const handleAcceptedCall = useCallback(async (data) => {
    const { ans } = data;
    console.log("Call accepted, setting remote answer:", ans); // Debugging
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
      console.log("Incoming call event received:", data); // Debugging
      await handleIncomingCall(data);
    });

    socket.on("call-accepted", async (data) => {
      console.log("Call accepted event received:", data); // Debugging
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
