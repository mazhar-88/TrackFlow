import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function useGoogleMaps({ zoom = 21 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY, // 👈 env se key
      version: "weekly",
    });

    loader.load().then(() => {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 31.5204, lng: 74.3587 },
        zoom,
      });

      // ✅ geolocation check
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const userLocation = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            mapInstance.current.setCenter(userLocation);

            if (!markerRef.current) {
              markerRef.current = new window.google.maps.Marker({
                position: userLocation,
                map: mapInstance.current,
                title: "You are here",
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white",
                },
              });
            } else {
              markerRef.current.setPosition(userLocation);
            }
          },
          (err) => console.error("Geolocation error:", err),
          { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      }
    });
  }, [zoom]);

  return { mapRef, mapInstance };
}
