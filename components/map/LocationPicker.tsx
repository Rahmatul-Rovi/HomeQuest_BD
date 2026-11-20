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