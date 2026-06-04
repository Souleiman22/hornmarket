"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
});

export default function MapViewWrapper({ location }: { location: string }) {
  return <MapView location={location} city={location} />;
}
