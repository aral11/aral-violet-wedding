import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, Download, LogOut, Camera, Users, Upload, Trash2, Eye, Clock, Plus, Edit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface WeddingFlowItem {
  id: string;
  time: string;
  title: string;
  description: string;
  duration?: string;
  type: 'ceremony' | 'reception' | 'entertainment' | 'meal' | 'special';
}

export default function AdminDashboard() {
  const { isAuthenticated, logout, user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [weddingFlow, setWeddingFlow] = useState<WeddingFlowItem[]>([]);
  const [invitationPDF, setInvitationPDF] = useState<string | null>(null);
  const [newFlowItem, setNewFlowItem] = useState<Omit<WeddingFlowItem, 'id'>>({
    time: '',
    title: '',
    description: '',
    duration: '',
    type: 'reception'
  });
  const [editingFlow, setEditingFlow] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGuests = localStorage.getItem('wedding_guests');
    const savedPhotos = localStorage.getItem('wedding_photos');
    const savedFlow = localStorage.getItem('wedding_flow');
    const savedInvitation = localStorage.getItem('wedding_invitation_pdf');

    if (savedGuests) {
      setGuests(JSON.parse(savedGuests));
    }

    if (savedPhotos) {
      setUploadedPhotos(JSON.parse(savedPhotos));
    }

    if (savedInvitation) {
      setInvitationPDF(savedInvitation);
    }

    if (savedFlow) {
      setWeddingFlow(JSON.parse(savedFlow));
    } else {
      // Default wedding flow
      const defaultFlow: WeddingFlowItem[] = [
        {
          id: '1',
          time: '7:00 PM',
          title: 'Welcome & Cocktails',
          description: 'Guests arrive and enjoy welcome drinks and appetizers',
          duration: '30 min',
          type: 'reception'
        },
        {
          id: '2',
          time: '7:30 PM',
          title: 'Grand Entrance',
          description: 'Introduction of the newly married couple',
          duration: '10 min',
          type: 'ceremony'
        },
        {
          id: '3',
          time: '8:00 PM',
          title: 'Dinner Service',
          description: 'Multi-cuisine buffet dinner',
          duration: '60 min',
          type: 'meal'
        },
        {
          id: '4',
          time: '9:00 PM',
          title: 'Cultural Performances',
          description: 'Traditional dance and music performances',
          duration: '45 min',
          type: 'entertainment'
        },
        {
          id: '5',
          time: '10:00 PM',
          title: 'Cake Cutting',
          description: 'Wedding cake cutting ceremony',
          duration: '15 min',
          type: 'special'
        },
        {
          id: '6',
          time: '10:30 PM',
          title: 'Dancing & Celebration',
          description: 'Open dance floor for all guests',
          duration: '60 min',
          type: 'entertainment'
        },
        {
          id: '7',
          time: '11:30 PM',
          title: 'Send-off',
          description: 'Farewell and thank you to all guests',
          duration: '',
          type: 'ceremony'
        }
      ];
      setWeddingFlow(defaultFlow);
      localStorage.setItem('wedding_flow', JSON.stringify(defaultFlow));
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

  // Save wedding flow to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wedding_flow', JSON.stringify(weddingFlow));
  }, [weddingFlow]);

  // Save invitation PDF to localStorage whenever it changes
  useEffect(() => {
    if (invitationPDF) {
      localStorage.setItem('wedding_invitation_pdf', invitationPDF);
    }
  }, [invitationPDF]);

  // Redirect if not authenticated (after all hooks)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const downloadWeddingFlow = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'ceremony': return '💒';
        case 'reception': return '🎉';
        case 'entertainment': return '🎵';
        case 'meal': return '🍽️';
        case 'special': return '✨';
        default: return '📋';
      }
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'ceremony': return '#5a6c57';
        case 'reception': return '#84a178';
        case 'entertainment': return '#9ca3af';
        case 'meal': return '#6b7280';
        case 'special': return '#d97706';
        default: return '#718096';
      }
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reception Flow - Aral & Violet Wedding</title>
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
            padding: 30px;
            margin-bottom: 30px;
            background: white;
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
            margin-bottom: 15px;
        }
        .venue-info {
            margin: 15px 0;
            font-size: 1em;
            color: #718096;
        }
        .timeline-container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .timeline-header {
            text-align: center;
            color: #5a6c57;
            font-size: 1.8em;
            margin-bottom: 30px;
            border-bottom: 2px solid #84a178;
            padding-bottom: 15px;
        }
        .timeline {
            position: relative;
            padding-left: 60px;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 30px;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(to bottom, #84a178, #5a6c57);
        }
        .timeline-item {
            position: relative;
            margin-bottom: 40px;
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            border-left: 4px solid #84a178;
            transition: transform 0.2s;
        }
        .timeline-item:hover {
            transform: translateX(5px);
        }
        .timeline-marker {
            position: absolute;
            left: -48px;
            top: 25px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            border: 3px solid #84a178;
            z-index: 1;
        }
        .timeline-time {
            font-size: 1.3em;
            font-weight: bold;
            color: #5a6c57;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .timeline-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .timeline-description {
            color: #4a5568;
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .timeline-duration {
            font-size: 0.9em;
            color: #718096;
            font-style: italic;
            background: white;
            padding: 5px 10px;
            border-radius: 15px;
            display: inline-block;
        }
        .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            color: white;
            margin-left: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .logo {
            color: #5a6c57;
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .note {
            background: #fef5e7;
            border: 2px solid #f6d55c;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        @media print {
            body {
                background: white;
            }
            .timeline-container, .header, .footer {
                box-shadow: none;
                border: 1px solid #e2e8f0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">💐 Wedding Reception Timeline</div>
        <div class="couple-names">Aral & Violet</div>
        <div class="wedding-date">December 28, 2025</div>
        <div class="venue-info">
            <div><strong>📍 Venue:</strong> Sai Radha Heritage Beach Resort, Kaup</div>
            <div><strong>⏰ Reception:</strong> 7:00 PM – 11:30 PM</div>
        </div>
        <div style="font-size: 0.9em; color: #a0aec0; margin-top: 15px;">Timeline Generated: ${currentDate}</div>
    </div>

    <div class="note">
        <div style="font-size: 1.1em; font-weight: bold; color: #d97706; margin-bottom: 10px;">🎉 Join Us for an Evening of Celebration!</div>
        <div style="color: #92400e;">All times are approximate and may vary based on the flow of celebration</div>
    </div>

    <div class="timeline-container">
        <div class="timeline-header">🕐 Reception Schedule</div>

        <div class="timeline">
            ${weddingFlow.map(item => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">
                    ⏰ ${item.time}
                    ${item.duration ? `<span class="timeline-duration">Duration: ${item.duration}</span>` : ''}
                </div>
                <div class="timeline-title">
                    ${getTypeIcon(item.type)} ${item.title}
                    <span class="type-badge" style="background-color: ${getTypeColor(item.type)}">
                        ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                </div>
                <div class="timeline-description">${item.description}</div>
            </div>
            `).join('')}
        </div>
    </div>

    <div class="footer">
        <div class="logo">❤️ TheVIRALWedding</div>
        <div style="font-size: 1.2em; margin: 10px 0;">A&V • 12.28.2025</div>
        <div style="color: #718096;">With hearts full of joy and blessings from above</div>
        <div style="margin-top: 15px; font-size: 0.9em; color: #a0aec0;">
            Thank you for being part of our special celebration
        </div>
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
            padding: 25px;
            border-bottom: 1px solid #e2e8f0;
            display: grid;
            grid-template-columns: 3fr 2fr 1.5fr;
            gap: 25px;
            align-items: start;
            transition: background-color 0.2s;
        }
        .guest-item:hover {
            background-color: #f8fafc;
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
            <div><strong>Reception:</strong> Sai Radha Heritage Beach Resort, Kaup • 7:00 PM</div>
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
                    ${guest.message ? `<div class="guest-message">💌 "${guest.message}"</div>` : ''}
                </div>
                <div class="guest-details">
                    <div style="margin-bottom: 8px;"><strong>👥 Total Guests:</strong> ${guest.guests}</div>
                    <div style="margin-bottom: 8px;"><strong>🏨 Accommodation:</strong> ${guest.needsAccommodation ? '✅ Required' : '❌ Not needed'}</div>
                    ${guest.dietaryRestrictions ? `<div style="margin-bottom: 8px;"><strong>🍽️ Dietary:</strong> ${guest.dietaryRestrictions}</div>` : '<div style="margin-bottom: 8px;"><strong>🍽️ Dietary:</strong> None specified</div>'}
                </div>
                <div class="guest-details">
                    <div style="margin-bottom: 5px;"><strong>📅 RSVP Date:</strong></div>
                    <div style="font-size: 0.9em;">${new Date(guest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style="font-size: 0.8em; color: #a0aec0; margin-top: 5px;">${new Date(guest.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
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
                    <span class="side-badge ${guest.side === 'groom' ? 'groom-side' : 'bride-side'}">
                        ${guest.side === 'groom' ? "Aral's Side" : "Violet's Side"}
                    </span>
                </div>
                <div class="guest-details">
                    <div style="margin-bottom: 8px;"><strong>👥 Total Guests:</strong> ${guest.guests}</div>
                    <div style="margin-bottom: 8px;"><strong>🏨 Accommodation:</strong> �� Required</div>
                </div>
                <div class="guest-details">
                    <div style="margin-bottom: 5px;"><strong>📅 RSVP Date:</strong></div>
                    <div style="font-size: 0.9em;">${new Date(guest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style="font-size: 0.8em; color: #a0aec0; margin-top: 5px;">${new Date(guest.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
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
                    <span class="side-badge ${guest.side === 'groom' ? 'groom-side' : 'bride-side'}">
                        ${guest.side === 'groom' ? "Aral's Side" : "Violet's Side"}
                    </span>
                    ${guest.message ? `<div class="guest-message">💌 "${guest.message}"</div>` : ''}
                </div>
                <div class="guest-details">
                    <div style="color: #e53e3e; font-weight: bold;">❌ Not Attending</div>
                </div>
                <div class="guest-details">
                    <div style="margin-bottom: 5px;"><strong>📅 RSVP Date:</strong></div>
                    <div style="font-size: 0.9em;">${new Date(guest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style="font-size: 0.8em; color: #a0aec0; margin-top: 5px;">${new Date(guest.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
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
    if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
      setUploadedPhotos(newPhotos);
      // Immediately update localStorage
      localStorage.setItem('wedding_photos', JSON.stringify(newPhotos));
      console.log('Photo removed successfully');
    }
  };

  const addFlowItem = () => {
    if (newFlowItem.time && newFlowItem.title) {
      const flowItem: WeddingFlowItem = {
        ...newFlowItem,
        id: Date.now().toString()
      };
      setWeddingFlow([...weddingFlow, flowItem].sort((a, b) => a.time.localeCompare(b.time)));
      setNewFlowItem({
        time: '',
        title: '',
        description: '',
        duration: '',
        type: 'reception'
      });
    }
  };

  const updateFlowItem = (id: string, updates: Partial<WeddingFlowItem>) => {
    setWeddingFlow(weddingFlow.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ).sort((a, b) => a.time.localeCompare(b.time)));
    setEditingFlow(null);
  };

  const removeFlowItem = (id: string) => {
    setWeddingFlow(weddingFlow.filter(item => item.id !== id));
  };

  const handleInvitationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Upload function called');
    const file = e.target.files?.[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Check if it's a PDF (more flexible check)
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file for the invitation.');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Please upload a PDF smaller than 10MB.');
      return;
    }

    console.log('File validation passed, reading file...');

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('File read successfully');
      if (event.target?.result) {
        const base64String = event.target.result as string;
        console.log('Setting invitation PDF...');
        setInvitationPDF(base64String);
        alert('Wedding invitation uploaded successfully!');
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Error reading PDF file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Clear the input
    e.target.value = '';
  };

  const attendingGuests = guests.filter(g => g.attending);
  const notAttendingGuests = guests.filter(g => !g.attending);
  const totalGuestCount = attendingGuests.reduce((sum, guest) => sum + guest.guests, 0);
  const accommodationNeeded = attendingGuests.filter(g => g.needsAccommodation);
  const accommodationGuestCount = accommodationNeeded.reduce((sum, guest) => sum + guest.guests, 0);
  const groomSideGuests = attendingGuests.filter(g => g.side === 'groom');
  const brideSideGuests = attendingGuests.filter(g => g.side === 'bride');

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-xs text-green-600 mt-1">{totalGuestCount} total guests</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center items-center mb-2">
                <span className="text-2xl">🏨</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{accommodationNeeded.length}</p>
              <p className="text-sm text-sage-600">Need Stay</p>
              <p className="text-xs text-amber-600 mt-1">{accommodationGuestCount} guests</p>
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

        {/* Additional Stats Row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center items-center mb-2">
                <span className="text-2xl">👰</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{brideSideGuests.length}</p>
              <p className="text-sm text-sage-600">Bride's Side</p>
              <p className="text-xs text-purple-600 mt-1">{brideSideGuests.reduce((sum, guest) => sum + guest.guests, 0)} guests</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center items-center mb-2">
                <span className="text-2xl">🤵</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{groomSideGuests.length}</p>
              <p className="text-sm text-sage-600">Groom's Side</p>
              <p className="text-xs text-blue-600 mt-1">{groomSideGuests.reduce((sum, guest) => sum + guest.guests, 0)} guests</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center items-center mb-2">
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{notAttendingGuests.length}</p>
              <p className="text-sm text-sage-600">Not Attending</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="rsvp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="rsvp" className="flex items-center gap-2">
              <Users size={16} />
              RSVP Management
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera size={16} />
              Photo Gallery
            </TabsTrigger>
            <TabsTrigger value="flow" className="flex items-center gap-2">
              <Clock size={16} />
              Wedding Flow
            </TabsTrigger>
            <TabsTrigger value="invitation" className="flex items-center gap-2">
              <FileText size={16} />
              Invitation
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
                    <div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => {
                          console.log('Photo upload button clicked');
                          photoInputRef.current?.click();
                        }}
                        className="bg-olive-600 hover:bg-olive-700 text-white"
                      >
                        <Upload className="mr-2" size={16} />
                        Choose Photos
                      </Button>
                    </div>
                    <p className="text-xs text-sage-500 mt-2">Select multiple photos • Maximum 5MB per photo</p>
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

          {/* Wedding Flow Management */}
          <TabsContent value="flow" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-olive-700">Reception Timeline Management</CardTitle>
                  <Button
                    onClick={downloadWeddingFlow}
                    className="bg-olive-600 hover:bg-olive-700 text-white"
                  >
                    <Download className="mr-2" size={16} />
                    Download Timeline PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add New Flow Item */}
                  <Card className="border-2 border-dashed border-sage-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-serif text-olive-700 mb-4 flex items-center gap-2">
                        <Plus size={20} />
                        Add Timeline Event
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">Time *</label>
                          <Input
                            type="time"
                            value={newFlowItem.time}
                            onChange={(e) => setNewFlowItem({...newFlowItem, time: e.target.value})}
                            className="border-sage-300 focus:border-olive-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">Duration</label>
                          <Input
                            type="text"
                            placeholder="e.g., 30 min, 1 hour"
                            value={newFlowItem.duration}
                            onChange={(e) => setNewFlowItem({...newFlowItem, duration: e.target.value})}
                            className="border-sage-300 focus:border-olive-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">Event Title *</label>
                          <Input
                            type="text"
                            placeholder="e.g., Welcome Cocktails"
                            value={newFlowItem.title}
                            onChange={(e) => setNewFlowItem({...newFlowItem, title: e.target.value})}
                            className="border-sage-300 focus:border-olive-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">Event Type</label>
                          <select
                            value={newFlowItem.type}
                            onChange={(e) => setNewFlowItem({...newFlowItem, type: e.target.value as WeddingFlowItem['type']})}
                            className="w-full p-2 border border-sage-300 rounded-md focus:border-olive-500"
                          >
                            <option value="reception">Reception</option>
                            <option value="ceremony">Ceremony</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="meal">Meal</option>
                            <option value="special">Special</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-sage-700 mb-2">Description</label>
                        <Textarea
                          placeholder="Describe what happens during this event..."
                          value={newFlowItem.description}
                          onChange={(e) => setNewFlowItem({...newFlowItem, description: e.target.value})}
                          className="border-sage-300 focus:border-olive-500"
                        />
                      </div>
                      <Button
                        onClick={addFlowItem}
                        disabled={!newFlowItem.time || !newFlowItem.title}
                        className="mt-4 bg-sage-600 hover:bg-sage-700 text-white"
                      >
                        <Plus className="mr-2" size={16} />
                        Add Event
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Current Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif text-olive-700">Current Reception Timeline</h3>
                    {weddingFlow.length === 0 ? (
                      <p className="text-center py-8 text-sage-600">No timeline events yet. Add some above to get started!</p>
                    ) : (
                      <div className="space-y-3">
                        {weddingFlow.map((item) => (
                          <Card key={item.id} className="border-l-4 border-l-olive-500">
                            <CardContent className="p-4">
                              {editingFlow === item.id ? (
                                <div className="space-y-3">
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <Input
                                      type="time"
                                      value={item.time}
                                      onChange={(e) => updateFlowItem(item.id, { time: e.target.value })}
                                    />
                                    <Input
                                      placeholder="Duration"
                                      value={item.duration}
                                      onChange={(e) => updateFlowItem(item.id, { duration: e.target.value })}
                                    />
                                  </div>
                                  <Input
                                    value={item.title}
                                    onChange={(e) => updateFlowItem(item.id, { title: e.target.value })}
                                  />
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) => updateFlowItem(item.id, { description: e.target.value })}
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => setEditingFlow(null)}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingFlow(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-lg font-bold text-olive-700">{item.time}</span>
                                      <span className={`px-2 py-1 text-xs rounded-full text-white ${
                                        item.type === 'ceremony' ? 'bg-olive-600' :
                                        item.type === 'reception' ? 'bg-sage-600' :
                                        item.type === 'entertainment' ? 'bg-gray-600' :
                                        item.type === 'meal' ? 'bg-amber-600' :
                                        'bg-purple-600'
                                      }`}>
                                        {item.type}
                                      </span>
                                      {item.duration && (
                                        <span className="text-sm text-sage-500">({item.duration})</span>
                                      )}
                                    </div>
                                    <h4 className="font-semibold text-sage-800 mb-1">{item.title}</h4>
                                    <p className="text-sage-600 text-sm">{item.description}</p>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingFlow(item.id)}
                                    >
                                      <Edit size={14} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => removeFlowItem(item.id)}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitation Management */}
          <TabsContent value="invitation" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200">
              <CardHeader>
                <CardTitle className="text-olive-700">Wedding Invitation Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upload Invitation */}
                  <div className="text-center p-8 border-2 border-dashed border-sage-300 rounded-lg">
                    <FileText className="mx-auto mb-4 text-olive-600" size={48} />
                    <h3 className="text-xl font-serif text-olive-700 mb-4">Upload Wedding Invitation PDF</h3>
                    <p className="text-sage-600 mb-4">
                      Upload your custom wedding invitation PDF. This will be downloaded when guests click the "Download Invitation" button.
                    </p>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleInvitationUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-olive-600 hover:bg-olive-700 text-white"
                      >
                        <Upload className="mr-2" size={16} />
                        Choose PDF Invitation
                      </Button>
                    </div>
                    <p className="text-xs text-sage-500 mt-2">Maximum file size: 10MB • PDF format only</p>
                  </div>

                  {/* Current Invitation Status */}
                  <Card className={`border-l-4 ${invitationPDF ? 'border-l-green-500 bg-green-50' : 'border-l-amber-500 bg-amber-50'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-2">
                            {invitationPDF ? '✅ Custom Invitation Active' : '⚠️ Using Default Text Invitation'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {invitationPDF
                              ? 'Your custom PDF invitation is active. Guests will download your uploaded PDF when they click the invitation button.'
                              : 'No custom invitation uploaded. Guests will download a basic text invitation. Upload a PDF above for a professional invitation.'
                            }
                          </p>
                        </div>
                        {invitationPDF && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = invitationPDF;
                                link.download = 'Wedding-Invitation-Preview.pdf';
                                link.click();
                              }}
                              className="bg-sage-600 hover:bg-sage-700 text-white"
                            >
                              <Download size={14} className="mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setInvitationPDF(null);
                                localStorage.removeItem('wedding_invitation_pdf');
                              }}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instructions */}
                  <Card className="bg-sage-50 border-sage-200">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-sage-800 mb-3">📋 How it works:</h4>
                      <ul className="space-y-2 text-sm text-sage-700">
                        <li>• Upload your professionally designed wedding invitation PDF</li>
                        <li>• Guests will download your custom invitation when they click "Download Invitation"</li>
                        <li>• You can preview or remove the invitation anytime</li>
                        <li>• If no PDF is uploaded, guests get a basic text invitation</li>
                        <li>• Maximum file size is 10MB for optimal download speed</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
