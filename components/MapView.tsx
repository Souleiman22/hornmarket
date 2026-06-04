"use client";
import { useEffect, useState } from "react";

type Props = { location: string; city?: string };

export default function MapView({ location, city }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const query = encodeURIComponent(city ?? location);

  useEffect(() => {
    setUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&marker=0,0&query=${query}`
    );
    // Use Nominatim to get coords and build a proper embed
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data[0]) {
          const { lat, lon } = data[0];
          const delta = 0.05;
          const bbox = `${+lon - delta},${+lat - delta},${+lon + delta},${+lat + delta}`;
          setUrl(
            `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
          );
        }
      })
      .catch(() => {});
  }, [query]);

  if (!url) return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <iframe
        src={url}
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        title="Localisation"
      />
      <div className="text-center py-1 text-xs text-gray-400">
        <a
          href={`https://www.openstreetmap.org/search?query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500"
        >
          Voir sur OpenStreetMap ↗
        </a>
      </div>
    </div>
  );
}
