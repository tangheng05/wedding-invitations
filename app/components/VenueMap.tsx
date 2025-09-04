'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VenueMapProps {
  venue: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function VenueMap({
  venue,
  address,
  coordinates,
}: VenueMapProps) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-serif text-amber-100 mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        Location
      </h3>
    </div>
  );
}
