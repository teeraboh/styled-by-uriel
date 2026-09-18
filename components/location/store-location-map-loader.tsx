"use client";

import dynamic from "next/dynamic";

const StoreLocationMap = dynamic(
  () =>
    import("@/components/location/store-location-map").then(
      (m) => m.StoreLocationMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-brand-sand flex items-center justify-center text-on-surface-variant text-xs font-medium">
        Loading map…
      </div>
    ),
  }
);

export function StoreLocationMapLoader() {
  return <StoreLocationMap />;
}