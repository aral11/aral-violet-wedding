import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, Download, LogOut, Camera, Users, Upload, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  guests: number;
  side: 'groom' | 'bride';
  message?: string;
  dietaryRestrictions?: string;
  needsAccommodation: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, logout, user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGuests = localStorage.getItem('wedding_guests');
    const savedPhotos = localStorage.getItem('wedding_photos');

    if (savedGuests) {
      setGuests(JSON.parse(savedGuests));
    }

    if (savedPhotos) {
      setUploadedPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Save guests to localStorage whenever guests state changes
  useEffect(() => {
    localStorage.setItem('wedding_guests', JSON.stringify(guests));
  }, [guests]);

  // Save photos to localStorage whenever photos state changes
  useEffect(() => {
    localStorage.setItem('wedding_photos', JSON.stringify(uploadedPhotos));
  }, [uploadedPhotos]);

  // Redirect if not authenticated (after all hooks)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const downloadGuestList = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Attending', 'Number of Guests', 'Dietary Restrictions', 'Needs Accommodation', 'Message', 'Submitted Date'],
      ...guests.map(guest => [
        guest.name,
        guest.email,
        guest.phone,
        guest.attending ? 'Yes' : 'No',
        guest.guests.toString(),
        guest.dietaryRestrictions || 'None',
        guest.needsAccommodation ? 'Yes' : 'No',
        guest.message || 'No message',
        new Date(guest.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aral-violet-wedding-rsvp-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        // Convert to base64 for persistent storage
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64String = event.target.result as string;
            setUploadedPhotos(prev => [...prev, base64String]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Clear the input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(newPhotos);
  };

  const attendingGuests = guests.filter(g => g.attending);
  const notAttendingGuests = guests.filter(g => !g.attending);
  const totalGuestCount = attendingGuests.reduce((sum, guest) => sum + guest.guests, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Heart className="text-olive-600" size={24} />
              <div>
                <h1 className="text-xl font-serif text-olive-700">Wedding Dashboard</h1>
                <p className="text-sm text-sage-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.open('/', '_blank')}
                className="border-sage-300 text-sage-600 hover:bg-sage-50"
              >
                <Eye className="mr-2" size={16} />
                View Site
              </Button>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2" size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-2 text-olive-600" size={32} />
              <p className="text-2xl font-bold text-olive-700">{guests.length}</p>
              <p className="text-sm text-sage-600">Total RSVPs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <Heart className="mx-auto mb-2 text-green-600" size={32} />
              <p className="text-2xl font-bold text-green-700">{attendingGuests.length}</p>
              <p className="text-sm text-sage-600">Attending</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-2 text-olive-600" size={32} />
              <p className="text-2xl font-bold text-olive-700">{totalGuestCount}</p>
              <p className="text-sm text-sage-600">Total Guests</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <Camera className="mx-auto mb-2 text-olive-600" size={32} />
              <p className="text-2xl font-bold text-olive-700">{uploadedPhotos.length}</p>
              <p className="text-sm text-sage-600">Photos</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="rsvp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="rsvp" className="flex items-center gap-2">
              <Users size={16} />
              RSVP Management
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera size={16} />
              Photo Gallery
            </TabsTrigger>
          </TabsList>

          {/* RSVP Management */}
          <TabsContent value="rsvp" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-olive-700">Guest List Management</CardTitle>
                  <Button 
                    onClick={downloadGuestList}
                    disabled={guests.length === 0}
                    className="bg-olive-600 hover:bg-olive-700 text-white"
                  >
                    <Download className="mr-2" size={16} />
                    Download CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guests.length === 0 ? (
                    <p className="text-center py-8 text-sage-600">No RSVPs received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {/* Attending Guests */}
                      {attendingGuests.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-700 mb-3">
                            Attending ({attendingGuests.length})
                          </h3>
                          <div className="space-y-3">
                            {attendingGuests.map((guest) => (
                              <div key={guest.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-green-800">{guest.name}</h4>
                                    <p className="text-sm text-green-600">{guest.email}</p>
                                    <p className="text-sm text-green-600">{guest.phone}</p>
                                  </div>
                                  <div className="text-sm text-green-700">
                                    <p><strong>Guests:</strong> {guest.guests}</p>
                                    <p><strong>Accommodation:</strong> {guest.needsAccommodation ? 'Yes' : 'No'}</p>
                                    {guest.dietaryRestrictions && (
                                      <p><strong>Dietary:</strong> {guest.dietaryRestrictions}</p>
                                    )}
                                    {guest.message && (
                                      <p className="italic mt-2">"{guest.message}"</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Not Attending Guests */}
                      {notAttendingGuests.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-red-700 mb-3">
                            Not Attending ({notAttendingGuests.length})
                          </h3>
                          <div className="space-y-3">
                            {notAttendingGuests.map((guest) => (
                              <div key={guest.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-red-800">{guest.name}</h4>
                                    <p className="text-sm text-red-600">{guest.email}</p>
                                    <p className="text-sm text-red-600">{guest.phone}</p>
                                  </div>
                                  <div className="text-sm text-red-700">
                                    {guest.message && (
                                      <p className="italic">"{guest.message}"</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photo Gallery Management */}
          <TabsContent value="photos" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
              <CardHeader>
                <CardTitle className="text-olive-700">Photo Gallery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="text-center p-8 border-2 border-dashed border-sage-300 rounded-lg">
                    <Camera className="mx-auto mb-4 text-olive-600" size={48} />
                    <h3 className="text-xl font-serif text-olive-700 mb-4">Upload Wedding Photos</h3>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button className="bg-olive-600 hover:bg-olive-700 text-white">
                        <Upload className="mr-2" size={16} />
                        Choose Photos
                      </Button>
                    </label>
                  </div>

                  {/* Photos Grid */}
                  {uploadedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                            <img
                              src={photo}
                              alt={`Wedding photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sage-600">No photos uploaded yet. Upload some beautiful memories!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
