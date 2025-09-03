'use client';

import { useState } from 'react';
import { Plus, Download, QrCode, Settings } from 'lucide-react';
import AddGuestModal from './AddGuestModal';
import GuestManagement from './GuestManagement';
import QRCodeGenerator from './QRCodeGenerator';
import LogoutButton from './LogoutButton';
import SettingsModal from './SettingsModal';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  rsvpStatus: string;
  uniqueLink: string;
  plusOne: boolean;
  plusOneName: string | null;
  createdAt: Date;
}

interface AdminDashboardProps {
  totalGuests: number;
  attendingGuests: number;
  pendingGuests: number;
  recentGuests: Guest[];
  allGuests: Guest[];
  adminName: string;
}

export default function AdminDashboard({
  totalGuests,
  attendingGuests,
  pendingGuests,
  recentGuests,
  allGuests,
  adminName
}: AdminDashboardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGuestAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const exportAllQRCodes = () => {
    // This would generate and download all QR codes as a zip file
    alert('QR Code bulk download feature coming soon!');
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Mobile-optimized header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Wedding Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {adminName}
                </span>
                <LogoutButton />
              </div>
            </div>
          </div>
            
          {/* Mobile-optimized stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        Total Guests
                      </dt>
                      <dd className="text-lg font-medium">{totalGuests}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        Responses Received
                      </dt>
                      <dd className="text-lg font-medium">{attendingGuests}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        Pending Responses
                      </dt>
                      <dd className="text-lg font-medium">{pendingGuests}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile-optimized Quick Actions */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 w-full"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Guest
                </Button>
                <Button
                  onClick={exportAllQRCodes}
                  variant="secondary"
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                  size="lg"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate All QR Codes
                </Button>
                <Button
                  onClick={() => setIsSettingsModalOpen(true)}
                  variant="outline"
                  className="w-full sm:col-span-2 lg:col-span-1"
                  size="lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Wedding Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-optimized QR Code Generation Section */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-lg">QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate and download QR codes for each guest's personalized invitation link.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {allGuests.map((guest) => (
                  <QRCodeGenerator key={guest.id} guest={guest} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Guest Management */}
          <GuestManagement 
            key={refreshKey}
            guests={allGuests} 
            onGuestUpdated={handleGuestAdded} 
          />
        </div>
      </div>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGuestAdded={handleGuestAdded}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSettingsSaved={() => {
          // Refresh the page to show updated settings
          window.location.reload();
        }}
      />
    </>
  );
}