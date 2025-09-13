import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapPlaceholder from "../../components/MapPlaceholder";
import api from "../../services/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import ParticipantList from "../../components/ParticipantList";

let socket;

export default function Session() {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [meetingMarker, setMeetingMarker] = useState(null);
  const [userId, setUserId] = useState(null);

  // 🔹 Socket listeners for map updates
  useEffect(() => {
    if (!map || !socket) return;

    // 🟢 Live location updates
    socket.on("locationUpdate", ({ userId, coords }) => {
      if (markers[userId]) {
        markers[userId].setPosition(coords);
      } else {
        const marker = new window.google.maps.Marker({
          position: coords,
          map,
          label: userId.slice(0, 2).toUpperCase(),
        });
        setMarkers((prev) => ({ ...prev, [userId]: marker }));
      }
    });

    // 📍 Meeting point updates
    socket.on("meetingPoint", ({ point }) => {
      if (meetingMarker) meetingMarker.setMap(null);
      const marker = new window.google.maps.Marker({
        position: point,
        map,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
      });
      setMeetingMarker(marker);
      map.panTo(point);
    });

    return () => {
      socket.off("locationUpdate");
      socket.off("meetingPoint");
    };
  }, [map, markers, meetingMarker]);

  // 🔹 Fetch session + connect socket
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchSession = async () => {
      try {
        const res = await api.get(`/session/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setParticipants(res.data.participants || []);
        setUserId(res.data.createdBy); // or actual logged-in user id
        setLoading(false);

        // socket connect
        socket = io(import.meta.env.VITE_API_BASE || "http://localhost:5000");
        socket.emit("joinSession", {
          sessionCode: id,
          userId: res.data.createdBy, // TODO: replace with actual logged-in user id
        });
      } catch (err) {
        console.error(err);
        toast.error(
          `❌ Failed to fetch session: ${err.response?.data?.message || err.message}`
        );
        setLoading(false);
      }
    };

    fetchSession();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // 📍 Suggest meeting point
  const suggestMeetingPoint = () => {
    if (!map) return;

    const listener = map.addListener("click", (e) => {
      const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      socket.emit("meetingPoint", { sessionCode: id, point });
      window.google.maps.event.removeListener(listener); // only once
    });

    toast.info("👉 Click on map to set meeting point");
  };

  // 🚀 Start sharing location
  const startSharingLocation = () => {
    if (!navigator.geolocation) {
      toast.error("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        socket.emit("locationUpdate", {
          sessionCode: id,
          userId: userId || "me",
          coords,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    toast.success("📡 Live location sharing started");
  };

  // 🚀 Leave Session
  const leaveSession = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/session/${id}/leave`, // 👈 backend route ko call karega
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Socket disconnect
      if (socket) {
        socket.emit("leaveSession", { sessionCode: id, userId });
        socket.disconnect();
      }

      toast.info("👋 You have left the session");
      // Redirect user to dashboard/home
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error(
        `❌ Failed to leave session: ${err.response?.data?.message || err.message}`
      );
    }
  };


  return (
    <div
      className="container-fluid"
      style={{
        overflowX: "hidden",
        background: "linear-gradient(135deg,#fdfbfb,#ebedee)",
        padding: "15px",
      }}
    >
      {/* Session Code Heading */}
      <p
        className="text-center fw-bold mb-3"
        style={{
          background: "linear-gradient(90deg,#667eea,#764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "1.1rem",
        }}
      >
        Session Code: {id}
      </p>

      <div className="row g-3">
        {/* Left Section */}
        <div className="col-12 col-lg-8 d-flex flex-column">
          <div className="card shadow-sm border-0 flex-grow-1 mb-3">
            <div className="card-body p-0" style={{ borderRadius: "12px" }}>
              <MapPlaceholder onMapLoad={setMap} />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn flex-grow-1 text-white fw-semibold"
              style={{
                background: "linear-gradient(90deg,#43e97b,#38f9d7)",
                border: "none",
                borderRadius: "8px",
              }}
              onClick={startSharingLocation}
            >
              🚀 Start Sharing Location
            </button>
            <button
              className="btn flex-grow-1 text-white fw-semibold"
              style={{
                background: "linear-gradient(90deg,#4facfe,#00f2fe)",
                border: "none",
                borderRadius: "8px",
              }}
              onClick={suggestMeetingPoint}
            >
              📍 Suggest Meeting Point
            </button>
            <button
              className="btn flex-grow-1 text-white fw-semibold"
              style={{
                background: "linear-gradient(90deg,#ff6a00,#ee0979)", // 🔴 red gradient
                border: "none",
                borderRadius: "8px",
              }}
              onClick={leaveSession}
            >
              👋 Leave Session
            </button>


          </div>
        </div>

        {/* Right Section (Participants) */}
        <div className="col-12 col-lg-4 d-flex flex-column">
          <div className="card shadow-sm border-0 h-100 d-flex flex-column">
            <div className="card-body d-flex flex-column p-3">
              <h6 className="fw-bold mb-3">Participants</h6>
              <ParticipantList participants={participants} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}