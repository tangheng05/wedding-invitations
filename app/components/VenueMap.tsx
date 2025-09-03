'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VenueMapProps {
  venue: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function VenueMap({ venue, address, coordinates }: VenueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add marker
      const marker = new window.google.maps.Marker({
        position: coordinates,
        map: map,
        title: venue,
        animation: window.google.maps.Animation.DROP
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${venue}</h3>
            <p class="text-gray-600">${address}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [coordinates, venue, address]);

  return (
    <div className="text-center">
      <h3 className="text-2xl font-serif text-gray-800 mb-6">Location</h3>
      <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-6 border border-pink-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">{venue}</h4>
        <p className="text-gray-600 mb-4">{address}</p>
        <div className="bg-white/50 rounded-lg p-4 mb-4">
          <p className="text-gray-500 text-sm">Interactive map coming soon</p>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
        >
          Open in Maps
        </a>
      </div>
    </div>
  );
}
