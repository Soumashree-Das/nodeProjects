import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SocketProvider from "./provider/SocketProvider";
import RoomPage from "./pages/RoomPage";

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage/>} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
