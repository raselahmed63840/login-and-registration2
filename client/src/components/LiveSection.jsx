import axios from "axios";
import React, { useEffect, useState } from "react";

const LiveSection = () => {
  const [lives, setLives] = useState([]);

  useEffect(() => {
    const loadLives = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/live/active");

        if (res.data?.success) {
          setLives(res.data.lives || []);
        }
      } catch (error) {
        console.error("Live fetch error:", error);
      }
    };

    loadLives();
  }, []);

  if (lives.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-5">Live Now</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lives.map((live) => (
          <div key={live._id} className="bg-white rounded-xl border p-4">
            <h3 className="text-xl font-bold mb-3">{live.title}</h3>

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={live.streamUrl}
                title={live.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              Host: {live.host?.fullName || "Admin"} ({live.hostType})
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveSection;