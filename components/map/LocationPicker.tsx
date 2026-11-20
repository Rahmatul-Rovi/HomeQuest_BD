"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, LocateFixed, Loader2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pinIcon } from "./mapIcons";

export type LatLng = { lat: number; lng: number };

type Props = {
  value: LatLng | null;
  onChange: (value: LatLng | null) => void;
  onAddressFound?: (address: string) => void;
};

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};
type FlyTarget = { lat: number; lng: number; id: number };

const DHAKA: [number, number] = [23.8103, 90.4125];

function ClickToPlace({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}