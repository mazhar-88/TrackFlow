import React, { useEffect, useState } from "react";
import useGoogleMaps from "../hooks/useGoogleMaps";

export default function MapPlaceholder({ onMapLoad , map}) {
  const { mapRef } = useGoogleMaps({
    center: { lat: 31.5204, lng: 74.3587 },
    zoom: 13,
  });

    useEffect(() => {
    if (map && onMapLoad) onMapLoad(map);
  }, [map, onMapLoad]);

  return (
    <div className="card card-map">
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
}
