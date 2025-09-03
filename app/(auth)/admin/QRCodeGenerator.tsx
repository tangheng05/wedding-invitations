'use client';

import { useState } from 'react';

interface Guest {
  id: string;
  name: string;
  uniqueLink: string;
}

interface QRCodeGeneratorProps {
  guest: Guest;
}

export default function QRCodeGenerator({ guest }: QRCodeGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const downloadQRCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/qr/${guest.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const svgBlob = await response.blob();
      const url = window.URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${guest.name}-qr-code.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download QR code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="text-center">
        <h4 className="font-medium text-gray-900 mb-2">{guest.name}</h4>
        
        {/* QR Code Display */}
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <img
            src={`/api/qr/${guest.id}`}
            alt={`QR Code for ${guest.name}`}
            className="w-24 h-24 mx-auto"
            loading="lazy"
          />
        </div>
        
        {/* Guest Link */}
        <p className="text-xs text-gray-500 mb-3 break-all">
          {guest.uniqueLink}
        </p>
        
        {/* Download Button */}
        <button
          onClick={downloadQRCode}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Download QR Code'}
        </button>
        
        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
