import React, { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";

const rtcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const LiveViewer = () => {
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [viewerName, setViewerName] = useState("Viewer");

  useEffect(() => {
    const onLiveStatus = ({ isLive }) => {
      setIsLive(isLive);
      if (isLive) {
        socket.emit("viewer-join");
      }
    };

    const onOffer = async ({ from, offer }) => {
      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice-candidate", {
            target: from,
            candidate: event.candidate,
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        target: from,
        answer,
      });
    };

    const onIceCandidate = async ({ candidate }) => {
      if (!peerConnectionRef.current || !candidate) return;
      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error("Viewer ICE add failed:", error);
      }
    };

    const onChatMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onLiveEnded = () => {
      setIsLive(false);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };

    socket.on("live-status", onLiveStatus);
    socket.on("webrtc-offer", onOffer);
    socket.on("webrtc-ice-candidate", onIceCandidate);
    socket.on("live-chat-message", onChatMessage);
    socket.on("live-ended", onLiveEnded);

    socket.emit("viewer-join");

    return () => {
      socket.off("live-status", onLiveStatus);
      socket.off("webrtc-offer", onOffer);
      socket.off("webrtc-ice-candidate", onIceCandidate);
      socket.off("live-chat-message", onChatMessage);
      socket.off("live-ended", onLiveEnded);

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socket.emit("live-chat-message", {
      sender: viewerName || "Viewer",
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
              <h1 className="text-2xl sm:text-3xl font-bold">Live Stream</h1>
              <p className="text-slate-500 mt-1">Watch admin live demo</p>
            </div>

            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isLive
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              {isLive ? "Live Now" : "Offline"}
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border bg-black">
            {isLive ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full aspect-video object-cover bg-black"
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-white text-lg">
                Live is offline
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-5 flex flex-col min-h-[500px]">
          <h2 className="text-xl font-bold mb-4">Live Chat</h2>

          <input
            type="text"
            value={viewerName}
            onChange={(e) => setViewerName(e.target.value)}
            placeholder="Your name"
            className="mb-3 border rounded-xl px-4 py-3"
          />

          <div className="flex-1 overflow-y-auto border rounded-xl p-3 bg-slate-50 space-y-3 min-h-[280px]">
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

export default LiveViewer;