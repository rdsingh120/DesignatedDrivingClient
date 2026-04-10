import React, { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";

function toLeafletLatLng(value) {
  if (!value) return null;

  if (typeof value.lat === "number" && typeof value.lng === "number") {
    return [value.lat, value.lng];
  }

  if (
    value.type === "Point" &&
    Array.isArray(value.coordinates) &&
    value.coordinates.length >= 2
  ) {
    const [lng, lat] = value.coordinates;
    if (typeof lat === "number" && typeof lng === "number") return [lat, lng];
  }

  if (
    Array.isArray(value.coordinates) &&
    value.coordinates.length >= 2 &&
    typeof value.coordinates[0] === "number" &&
    typeof value.coordinates[1] === "number"
  ) {
    const [lng, lat] = value.coordinates;
    return [lat, lng];
  }

  if (
    typeof value.latitude === "number" &&
    typeof value.longitude === "number"
  ) {
    return [value.latitude, value.longitude];
  }

  return null;
}

function computeBounds(points) {
  if (!points?.length) return null;

  let minLat = points[0][0];
  let maxLat = points[0][0];
  let minLng = points[0][1];
  let maxLng = points[0][1];

  for (const [lat, lng] of points) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, bounds]);
  return null;
}

export default function RoutePreviewMap({
  pickup,
  dropoff,
  driverLocation,
  route_polyline,
  height = 420,
  defaultCenter = [43.6532, -79.3832],
  defaultZoom = 13,
}) {
  const pickupLL = useMemo(() => toLeafletLatLng(pickup), [pickup]);
  const dropoffLL = useMemo(() => toLeafletLatLng(dropoff), [dropoff]);
  const driverLL = useMemo(() => toLeafletLatLng(driverLocation), [driverLocation]);

  const routePoints = useMemo(() => {
    if (!route_polyline) return [];
    try {
      return polyline.decode(route_polyline);
    } catch {
      return [];
    }
  }, [route_polyline]);

  const bounds = useMemo(() => {
    const pts = [];
    if (pickupLL) pts.push(pickupLL);
    if (dropoffLL) pts.push(dropoffLL);
    if (driverLL) pts.push(driverLL);
    if (routePoints.length) pts.push(...routePoints);
    return computeBounds(pts);
  }, [pickupLL, dropoffLL, driverLL, routePoints]);

  const center = useMemo(() => {
    if (pickupLL) return pickupLL;
    if (dropoffLL) return dropoffLL;
    if (driverLL) return driverLL;
    return defaultCenter;
  }, [pickupLL, dropoffLL, driverLL, defaultCenter]);

  return (
    <div style={{ width: "100%", height, borderRadius: 12, overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={defaultZoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bounds && <FitBounds bounds={bounds} />}
        {pickupLL && <Marker position={pickupLL} />}
        {driverLL && <Marker position={driverLL} />}
        {dropoffLL && <Marker position={dropoffLL} />}
        {routePoints.length > 0 && <Polyline positions={routePoints} />}
      </MapContainer>
    </div>
  );
}