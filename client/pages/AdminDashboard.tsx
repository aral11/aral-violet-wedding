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
    const attendingGuests = guests.filter(g => g.attending);
    const notAttendingGuests = guests.filter(g => !g.attending);
    const groomSideGuests = attendingGuests.filter(g => g.side === 'groom');
    const brideSideGuests = attendingGuests.filter(g => g.side === 'bride');
    const totalGuestCount = attendingGuests.reduce((sum, guest) => sum + guest.guests, 0);
    const accommodationNeeded = attendingGuests.filter(g => g.needsAccommodation);

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wedding Guest List - Aral & Violet</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #84a178;
            padding-bottom: 20px;
            margin-bottom: 30px;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .couple-names {
            font-size: 2.5em;
            color: #5a6c57;
            margin: 10px 0;
            font-weight: bold;
        }
        .wedding-date {
            font-size: 1.2em;
            color: #718096;
            margin-bottom: 10px;
        }
        .report-date {
            font-size: 0.9em;
            color: #a0aec0;
        }
        .summary {
            background: white;
            padding: 25px;
            margin: 20px 0;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .summary h2 {
            color: #5a6c57;
            border-bottom: 2px solid #84a178;
            padding-bottom: 10px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #84a178;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #5a6c57;
        }
        .stat-label {
            color: #718096;
            font-size: 0.9em;
        }
        .section {
            background: white;
            margin: 20px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .section-header {
            background: #5a6c57;
            color: white;
            padding: 15px 25px;
            font-size: 1.2em;
            font-weight: bold;
        }
        .guest-list {
            padding: 0;
        }
        .guest-item {
            padding: 20px 25px;
            border-bottom: 1px solid #e2e8f0;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 20px;
            align-items: start;
        }
        .guest-item:last-child {
            border-bottom: none;
        }
        .guest-main {
            color: #2d3748;
        }
        .guest-name {
            font-weight: bold;
            font-size: 1.1em;
            color: #5a6c57;
        }
        .guest-contact {
            font-size: 0.9em;
            color: #718096;
            margin: 5px 0;
        }
        .guest-details {
            font-size: 0.9em;
            color: #4a5568;
        }
        .guest-message {
            font-style: italic;
            color: #718096;
            margin-top: 10px;
            padding: 10px;
            background: #f7fafc;
            border-radius: 5px;
        }
        .side-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            color: white;
        }
        .groom-side {
            background: #84a178;
        }
        .bride-side {
            background: #9ca3af;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #a0aec0;
            font-size: 0.9em;
        }
        .logo {
            color: #5a6c57;
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        @media print {
            body {
                background: white;
            }
            .section, .summary, .header {
                box-shadow: none;
                border: 1px solid #e2e8f0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">❤️ TheVIRALWedding</div>
        <div class="couple-names">Aral & Violet</div>
        <div class="wedding-date">December 28, 2025</div>
        <div style="margin: 15px 0; font-size: 1em; color: #718096;">
            <div><strong>Church Nuptials:</strong> Mother of Sorrows Church, Udupi • 4:00 PM</div>
            <div><strong>Reception:</strong> Sai Radha Beach Resort, Kaup • 7:00 PM</div>
        </div>
        <div class="report-date">RSVP Report Generated: ${currentDate}</div>
    </div>

    <div class="summary">
        <h2>📊 Wedding Summary</h2>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${guests.length}</div>
                <div class="stat-label">Total RSVPs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${attendingGuests.length}</div>
                <div class="stat-label">Attending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalGuestCount}</div>
                <div class="stat-label">Total Guests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${accommodationNeeded.length}</div>
                <div class="stat-label">Need Accommodation</div>
            </div>
        </div>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${groomSideGuests.length}</div>
                <div class="stat-label">Groom's Side</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${brideSideGuests.length}</div>
                <div class="stat-label">Bride's Side</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${notAttendingGuests.length}</div>
                <div class="stat-label">Not Attending</div>
            </div>
        </div>
    </div>

    ${attendingGuests.length > 0 ? `
    <div class="section">
        <div class="section-header">✅ Attending Guests (${attendingGuests.length})</div>
        <div class="guest-list">
            ${attendingGuests.map(guest => `
            <div class="guest-item">
                <div class="guest-main">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-contact">📧 ${guest.email}</div>
                    <div class="guest-contact">📱 ${guest.phone}</div>
                    <span class="side-badge ${guest.side === 'groom' ? 'groom-side' : 'bride-side'}">
                        ${guest.side === 'groom' ? "Aral's Side" : "Violet's Side"}
                    </span>
                    ${guest.message ? `<div class="guest-message">"${guest.message}"</div>` : ''}
                </div>
                <div class="guest-details">
                    <div><strong>Guests:</strong> ${guest.guests}</div>
                    <div><strong>Accommodation:</strong> ${guest.needsAccommodation ? 'Yes' : 'No'}</div>
                    ${guest.dietaryRestrictions ? `<div><strong>Dietary:</strong> ${guest.dietaryRestrictions}</div>` : ''}
                </div>
                <div class="guest-details">
                    <div><strong>RSVP Date:</strong></div>
                    <div>${new Date(guest.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${accommodationNeeded.length > 0 ? `
    <div class="section">
        <div class="section-header">🏨 Accommodation Required (${accommodationNeeded.length})</div>
        <div class="guest-list">
            ${accommodationNeeded.map(guest => `
            <div class="guest-item">
                <div class="guest-main">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-contact">📧 ${guest.email}</div>
                    <div class="guest-contact">📱 ${guest.phone}</div>
                </div>
                <div class="guest-details">
                    <div><strong>Guests:</strong> ${guest.guests}</div>
                    <span class="side-badge ${guest.side === 'groom' ? 'groom-side' : 'bride-side'}">
                        ${guest.side === 'groom' ? "Aral's Side" : "Violet's Side"}
                    </span>
                </div>
                <div class="guest-details">
                    <div><strong>RSVP Date:</strong></div>
                    <div>${new Date(guest.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${notAttendingGuests.length > 0 ? `
    <div class="section">
        <div class="section-header">❌ Not Attending (${notAttendingGuests.length})</div>
        <div class="guest-list">
            ${notAttendingGuests.map(guest => `
            <div class="guest-item">
                <div class="guest-main">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-contact">📧 ${guest.email}</div>
                    <div class="guest-contact">📱 ${guest.phone}</div>
                    ${guest.message ? `<div class="guest-message">"${guest.message}"</div>` : ''}
                </div>
                <div class="guest-details">
                    <span class="side-badge ${guest.side === 'groom' ? 'groom-side' : 'bride-side'}">
                        ${guest.side === 'groom' ? "Aral's Side" : "Violet's Side"}
                    </span>
                </div>
                <div class="guest-details">
                    <div><strong>RSVP Date:</strong></div>
                    <div>${new Date(guest.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <div class="logo">❤️ TheVIRALWedding</div>
        <div>A&V • 12.28.2025</div>
        <div>With hearts full of joy and blessings from above</div>
    </div>
</body>
</html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Auto-download as PDF
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Process each file
      Array.from(files).forEach(file => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          alert('Please upload only image files.');
          return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Please upload images smaller than 5MB.');
          return;
        }

        // Convert to base64 for persistent storage
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64String = event.target.result as string;
            setUploadedPhotos(prev => {
              const newPhotos = [...prev, base64String];
              // Also immediately save to localStorage
              localStorage.setItem('wedding_photos', JSON.stringify(newPhotos));
              return newPhotos;
            });
          }
        };
        reader.onerror = () => {
          alert('Error reading file. Please try again.');
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
                                    <p><strong>Side:</strong> {guest.side === 'groom' ? "Aral's (Groom)" : "Violet's (Bride)"}</p>
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
                                    <p><strong>Side:</strong> {guest.side === 'groom' ? "Aral's (Groom)" : "Violet's (Bride)"}</p>
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
