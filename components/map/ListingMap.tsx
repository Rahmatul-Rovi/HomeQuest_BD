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