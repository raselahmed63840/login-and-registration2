import React, { useEffect, useRef, useState } from "react";
import socket from "../../lib/socket";

const rtcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const AdminLive = () => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const [isLive, setIsLive] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onViewerJoined = async ({ viewerId }) => {
      if (!localStreamRef.current) return;

      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionsRef.current[viewerId] = pc;

      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice-candidate", {
            target: viewerId,
            candidate: event.candidate,
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc-offer", {
        target: viewerId,
        offer,
      });
    };

    const onAnswer = async ({ from, answer }) => {
      const pc = peerConnectionsRef.current[from];
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const onIceCandidate = async ({ from, candidate }) => {
      const pc = peerConnectionsRef.current[from];
      if (!pc || !candidate) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Admin ICE add failed:", error);
      }
    };

    const onChatMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onLiveEnded = () => {
      setIsLive(false);
    };

    socket.on("viewer-joined", onViewerJoined);
    socket.on("webrtc-answer", onAnswer);
    socket.on("webrtc-ice-candidate", onIceCandidate);
    socket.on("live-chat-message", onChatMessage);
    socket.on("live-ended", onLiveEnded);

    return () => {
      socket.off("viewer-joined", onViewerJoined);
      socket.off("webrtc-answer", onAnswer);
      socket.off("webrtc-ice-candidate", onIceCandidate);
      socket.off("live-chat-message", onChatMessage);
      socket.off("live-ended", onLiveEnded);
    };
  }, []);

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket.emit("admin-start-live");
      setIsLive(true);
    } catch (error) {
      console.error("Start live failed:", error);
      alert("Camera/Microphone access denied or unavailable.");
    }
  };

  const stopLive = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    localStreamRef.current = null;
    socket.emit("admin-stop-live");
    setIsLive(false);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socket.emit("live-chat-message", {
      sender: "Admin",
      text: chatInput.trim(),
    });

    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Live Streaming</h1>
              <p className="text-slate-500 mt-1">
                Demo live stream with chat
              </p>
            </div>

            <div className="flex gap-3">
              {!isLive ? (
                <button
                  onClick={startLive}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Start Live
                </button>
              ) : (
                <button
                  onClick={stopLive}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Stop Live
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover bg-black"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isLive
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              {isLive ? "Live On" : "Offline"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-5 flex flex-col min-h-[500px]">
          <h2 className="text-xl font-bold mb-4">Live Chat</h2>

          <div className="flex-1 overflow-y-auto border rounded-xl p-3 bg-slate-50 space-y-3 min-h-[320px]">
            {messages.length === 0 ? (
              <p className="text-slate-500">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white border rounded-xl p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{msg.sender}</p>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Write a message..."
              className="flex-1 border rounded-xl px-4 py-3"
            />
            <button
              onClick={sendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLive;