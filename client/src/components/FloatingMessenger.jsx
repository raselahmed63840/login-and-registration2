import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const MessengerIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5A8.48 8.48 0 0 1 21 11v.5Z" />
    <path d="M8 12h.01" />
    <path d="M12 12h.01" />
    <path d="M16 12h.01" />
  </svg>
);

const FloatingMessenger = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {open && (
        <div className="fixed right-5 bottom-[160px] z-[9999] w-[300px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-orange-500 text-white px-4 py-3">
            <h3 className="text-[17px] font-bold">ShopEase Support</h3>
            <p className="text-[13px] opacity-90">How can we help you?</p>
          </div>

          <div className="p-4 space-y-3">
            <a
              href="https://m.me/1429365708852442"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border rounded-xl px-4 py-3 hover:bg-orange-50 transition"
            >
              <span className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg">
                f
              </span>

              <div>
                <p className="font-semibold text-slate-900">Messenger</p>
                <p className="text-xs text-slate-500">
                  Chat with us on Facebook
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/8801863840408"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border rounded-xl px-4 py-3 hover:bg-orange-50 transition"
            >
              <span className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center text-lg">
                ☎
              </span>

              <div>
                <p className="font-semibold text-slate-900">WhatsApp</p>
                <p className="text-xs text-slate-500">Message us directly</p>
              </div>
            </a>

            <a
              href="tel:+8801863840408"
              className="flex items-center gap-3 border rounded-xl px-4 py-3 hover:bg-orange-50 transition"
            >
              <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg">
                📞
              </span>

              <div>
                <p className="font-semibold text-slate-900">Call Now</p>
                <p className="text-xs text-slate-500">+880 1863-840408</p>
              </div>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-5 bottom-24 z-[9999] w-[58px] h-[58px] rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl hover:bg-orange-600 hover:scale-105 transition-all duration-300"
      >
        {open ? (
          <span className="text-3xl leading-none">×</span>
        ) : (
          <MessengerIcon />
        )}
      </button>
    </>
  );
};

export default FloatingMessenger;
