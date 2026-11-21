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

export default function ListingMap({ listings }: { listings: MapListing[] }) {
  const located = useMemo(
    () =>
      listings.filter(
        (l): l is Located => typeof l.lat === "number" && typeof l.lng === "number"
      ),
    [listings]
  );

  const points = useMemo(
    () => located.map((l) => [l.lat, l.lng] as [number, number]),
    [located]
  );

  const markers = useMemo(
    () => located.map((l) => ({ listing: l, icon: createPriceIcon(l.price, l.listingType) })),
    [located]
  );

  return (
    <div className="relative isolate h-[70vh] min-h-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer center={DHAKA} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers points={points} />

        {markers.map(({ listing: l, icon }) => (
          <Marker key={l.id} position={[l.lat, l.lng]} icon={icon}>
            <Popup minWidth={230} maxWidth={250}>
              <Link
                href={`/listings/${l.id}`}
                style={{ display: "block", color: "inherit", textDecoration: "none" }}
              >
                {l.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.images[0]}
                    alt={l.title}
                    style={{
                      width: "100%",
                      height: 110,
                      objectFit: "cover",
                      borderRadius: 10,
                      marginBottom: 8,
                    }}
                  />
                )}
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", lineHeight: 1.3 }}>
                  {l.title}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{l.address}</div>
                {(l.bedroom || l.bathroom) && (
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
                    {l.bedroom ? `${l.bedroom} bed` : ""}
                    {l.bedroom && l.bathroom ? " · " : ""}
                    {l.bathroom ? `${l.bathroom} bath` : ""}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#16A34A", fontSize: 14 }}>
                    ৳{l.price.toLocaleString()}
                    {l.listingType === "RENT" && (
                      <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: 11 }}> /mo</span>
                    )}
                  </span>
                  <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>View →</span>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}