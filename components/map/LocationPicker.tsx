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

function FlyTo({ target }: { target: FlyTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function LocationPicker({ value, onChange, onAddressFound }: Props) {
  const markerRef = useRef<LeafletMarker>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);

  const initialCenter: [number, number] = value ? [value.lat, value.lng] : DHAKA;

  const markerEvents = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const { lat, lng } = marker.getLatLng();
          onChange({ lat, lng });
        }
      },
    }),
    [onChange]
  );

  const moveTo = (p: LatLng) => {
    onChange(p);
    setFlyTarget({ ...p, id: Date.now() });
  };

  // Search only on button/Enter  (not for the type), OSM policy
  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 3) {
      setMessage("Type at least 3 characters to search.");
      return;
    }
    setSearching(true);
    setMessage(null);
    setResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=bd&accept-language=en&q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data: SearchResult[] = await res.json();
      if (data.length === 0) {
        setMessage("No places found. Try a nearby landmark, or click on the map.");
      }
      setResults(data);
    } catch {
      setMessage("Search is unavailable right now. You can still click on the map.");
    } finally {
      setSearching(false);
    }
  };

  const pickResult = (r: SearchResult) => {
    moveTo({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) });
    onAddressFound?.(r.display_name);
    setResults([]);
    setMessage(null);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location.");
      return;
    }
    setLocating(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        moveTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setMessage("Could not get your location. Allow location access or click on the map.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex items-center flex-1 border border-gray-200 rounded-lg px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
          <Search size={16} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search area or landmark (e.g. Mirpur 10)"
            className="w-full py-2.5 text-sm outline-none bg-transparent"
          />
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="bg-primary hover:bg-primary-dark text-white shrink-0"
        >
          {searching ? <Loader2 size={16} className="animate-spin" /> : "Search"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={locateMe}
          disabled={locating}
          title="Use my current location"
          className="shrink-0"
        >
          {locating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LocateFixed size={16} />
          )}
        </Button>
      </div>

      {message && <p className="text-xs text-amber-600">{message}</p>}

      {results.length > 0 && (
        <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white overflow-hidden">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                onClick={() => pickResult(r)}
                className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-primary-light hover:text-primary flex items-start gap-2 transition"
              >
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* isolate: Leaflet er z-index navbar/modal stop to go to the upper section */}
      <div className="relative isolate h-72 sm:h-80 rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={initialCenter}
          zoom={value ? 16 : 12}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPick={(p) => onChange(p)} />
          <FlyTo target={flyTarget} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon}
              draggable
              ref={markerRef}
              eventHandlers={markerEvents}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        {value ? (
          <span className="text-primary font-medium flex items-center gap-1">
            <MapPin size={13} /> Pinned: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        ) : (
          <span className="text-gray-400">
            Click on the map to drop a pin, or search above. You can drag the pin to adjust.
          </span>
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-red-500 hover:underline flex items-center gap-1 shrink-0"
          >
            <X size={12} /> Remove pin
          </button>
        )}
      </div>
    </div>
  );
}