import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaf-green.png",
  iconRetinaUrl: "/leaf-green.png",
  shadowUrl: "/leaf-shadow.png",
});

interface MapProps {
  onPositionChange: (lat: number, lng: number) => void;
}

function DraggableMarker({ onPositionChange }: MapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition(position);
          onPositionChange(position.lat, position.lng);
        },
      }}
    />
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Map({ onPositionChange }: MapProps) {
  const [userLocation, setUserLocation] = useState<[number, number]>([
    51.505, -0.09,
  ]); // Default to London
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(newLocation);
          onPositionChange(newLocation[0], newLocation[1]);
          if (mapRef.current) {
            mapRef.current.setView(newLocation, 13);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, [onPositionChange]);

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <DraggableMarker onPositionChange={onPositionChange} />
      <MapUpdater center={userLocation} />
    </MapContainer>
  );
}
