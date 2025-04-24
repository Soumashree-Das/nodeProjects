// import React, { createContext, useContext, useMemo } from "react";

// const PeerContext = createContext(null);

// export const usePeer = () =>{return useContext(PeerContext)};

// function Peer({children}) {
//   const peer = useMemo(() => {
//     return new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: [
//             "stun:stun1.l.google.com:19302",
//             "stun:stun2.l.google.com:19302",
//           ],
//         },
//       ],
//       iceCandidatePoolSize: 10,
//     });
//   }, []);

//   const createOffer = async () => {
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     return offer;
//   };

//   const createAnswer = async (offer) => {
//     await peer.setRemoteDescription(offer);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     return answer;
//   };

//   const setRemoteAnswer = async (ans) => {
//     await peer.setRemoteDescription(ans);
//   };

//   return (
//     <PeerContext.Provider
//       value={{ peer, createOffer, createAnswer, setRemoteAnswer }}
//     >
//       {children}
//     </PeerContext.Provider>
//   );
// }

// export default Peer;


import React, { createContext, useContext, useMemo } from "react";

const PeerContext = createContext(null);

// ✅ Top-level named export for hook
export const usePeer = () => {
  return useContext(PeerContext);
};

// ✅ Top-level named export for provider component (instead of default export)
export function PeerProvider({ children }) {
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    });
  }, []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    console.log("peer.jsx-offer from createoffer():",offer);
    
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    console.log("peer.jsx-anser from createanswer():",offer);
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (ans) => {
    console.log("ans passing to peer.setRemoteDescription(ans) in peer.jsx setRemoteAnswer(): ",ans);
    
    await peer.setRemoteDescription(ans);
  };

  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAnswer }}
    >
      {children}
    </PeerContext.Provider>
  );
}
