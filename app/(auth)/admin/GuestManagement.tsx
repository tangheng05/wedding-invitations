'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface GuestManagementProps {
  guests: Guest[];
  onGuestUpdated: () => void;
}

export default function GuestManagement({ guests, onGuestUpdated }: GuestManagementProps) {
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    rsvpStatus: '',
    plusOne: false,
    plusOneName: ''
  });

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setEditForm({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      relationship: guest.relationship || '',
      rsvpStatus: guest.rsvpStatus,
      plusOne: guest.plusOne,
      plusOneName: guest.plusOneName || ''
    });
  };

  const handleSave = async () => {
    if (!editingGuest) return;

    try {
      const response = await fetch(`/api/guests/${editingGuest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        onGuestUpdated();
        setEditingGuest(null);
      }
    } catch (error) {
      console.error('Error updating guest:', error);
    }
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onGuestUpdated();
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const exportGuestList = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Relationship', 'RSVP Status', 'Plus One', 'Plus One Name', 'Unique Link'],
      ...guests.map(guest => [
        guest.name,
        guest.email || '',
        guest.phone || '',
        guest.relationship || '',
        guest.rsvpStatus,
        guest.plusOne ? 'Yes' : 'No',
        guest.plusOneName || '',
        `${window.location.origin}/${guest.uniqueLink}`
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guest-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardTitle className="text-lg">Guest Management</CardTitle>
          <Button
            onClick={exportGuestList}
            variant="secondary"
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile: Card layout, Desktop: Table layout */}
        <div className="block sm:hidden">
          {/* Mobile card layout */}
          <div className="space-y-4">
            {guests.map((guest) => (
              <Card key={guest.id} className="p-4">
                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    {editingGuest?.id === guest.id ? (
                      <Input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="font-medium mt-1">{guest.name}</div>
                    )}
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact</label>
                    {editingGuest?.id === guest.id ? (
                      <div className="space-y-2 mt-1">
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
                        />
                        <Input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Phone"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-1">
                        <div>{guest.email || 'No email'}</div>
                        <div>{guest.phone || 'No phone'}</div>
                      </div>
                    )}
                  </div>

                  {/* RSVP Status */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">RSVP Status</label>
                    {editingGuest?.id === guest.id ? (
                      <Select
                        value={editForm.rsvpStatus}
                        onValueChange={(value) => setEditForm({ ...editForm, rsvpStatus: value })}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ATTENDING">Attending</SelectItem>
                          <SelectItem value="NOT_ATTENDING">Not Attending</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <Badge variant={
                          guest.rsvpStatus === 'ATTENDING' 
                            ? 'default'
                            : guest.rsvpStatus === 'NOT_ATTENDING'
                            ? 'destructive'
                            : 'secondary'
                        }>
                          {guest.rsvpStatus}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Plus One */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Plus One</label>
                    {editingGuest?.id === guest.id ? (
                      <div className="space-y-2 mt-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`plusOne-${guest.id}`}
                            checked={editForm.plusOne}
                            onCheckedChange={(checked) => setEditForm({ ...editForm, plusOne: checked === true })}
                          />
                          <Label htmlFor={`plusOne-${guest.id}`}>Plus One</Label>
                        </div>
                        {editForm.plusOne && (
                          <Input
                            type="text"
                            value={editForm.plusOneName}
                            onChange={(e) => setEditForm({ ...editForm, plusOneName: e.target.value })}
                            placeholder="Plus one name"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-1">
                        {guest.plusOne ? (
                          <div>
                            <span className="text-green-600">✓</span> {guest.plusOneName || 'Unnamed'}
                          </div>
                        ) : (
                          <span className="text-gray-400">✗</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t">
                    {editingGuest?.id === guest.id ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-900 flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingGuest(null)}
                          size="sm"
                          variant="outline"
                          className="text-gray-600 hover:text-gray-900 flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(guest)}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900 flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-900 flex-1"
                        >
                          <a
                            href={`/${guest.uniqueLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          onClick={() => handleDelete(guest.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-900 flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop table layout */}
        <div className="hidden sm:block overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead>Plus One</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    {editingGuest?.id === guest.id ? (
                      <Input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <div className="font-medium">{guest.name}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGuest?.id === guest.id ? (
                      <div className="space-y-2">
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
                          className="text-xs"
                        />
                        <Input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Phone"
                          className="text-xs"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <div>{guest.email || 'No email'}</div>
                        <div>{guest.phone || 'No phone'}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGuest?.id === guest.id ? (
                      <Select
                        value={editForm.rsvpStatus}
                        onValueChange={(value) => setEditForm({ ...editForm, rsvpStatus: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ATTENDING">Attending</SelectItem>
                          <SelectItem value="NOT_ATTENDING">Not Attending</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={
                        guest.rsvpStatus === 'ATTENDING' 
                          ? 'default'
                          : guest.rsvpStatus === 'NOT_ATTENDING'
                          ? 'destructive'
                          : 'secondary'
                      }>
                        {guest.rsvpStatus}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGuest?.id === guest.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`plusOne-${guest.id}`}
                            checked={editForm.plusOne}
                            onCheckedChange={(checked) => setEditForm({ ...editForm, plusOne: checked === true })}
                          />
                          <Label htmlFor={`plusOne-${guest.id}`} className="text-xs">Plus One</Label>
                        </div>
                        {editForm.plusOne && (
                          <Input
                            type="text"
                            value={editForm.plusOneName}
                            onChange={(e) => setEditForm({ ...editForm, plusOneName: e.target.value })}
                            placeholder="Plus one name"
                            className="text-xs"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {guest.plusOne ? (
                          <div>
                            <span className="text-green-600">✓</span> {guest.plusOneName || 'Unnamed'}
                          </div>
                        ) : (
                          <span className="text-gray-400">✗</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGuest?.id === guest.id ? (
                      <div className="space-x-2">
                        <Button
                          onClick={handleSave}
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingGuest(null)}
                          size="sm"
                          variant="outline"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <Button
                          onClick={() => handleEdit(guest)}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-900"
                        >
                          <a
                            href={`/${guest.uniqueLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          onClick={() => handleDelete(guest.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
