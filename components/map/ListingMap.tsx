"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { createPriceIcon } from "./mapIcons";

export type MapListing = {
  id: string;
  title: string;
  price: number;
  address: string;
  listingType: "RENT" | "SALE";
  bedroom: number | null;
  bathroom: number | null;
  images: string[];
  lat: number | null;
  lng: number | null;
};

type Located = MapListing & { lat: number; lng: number };

const DHAKA: [number, number] = [23.8103, 90.4125];

function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    map.fitBounds(latLngBounds(points), { padding: [48, 48], maxZoom: 16 });
  }, [points, map]);
  return null;
}
