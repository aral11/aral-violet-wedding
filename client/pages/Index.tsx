import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Camera, Users, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  guests: number;
  message?: string;
  dietaryRestrictions?: string;
  needsAccommodation: boolean;
  createdAt: string;
}

export default function Index() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    phone: '',
    attending: true,
    guests: 1,
    message: '',
    dietaryRestrictions: '',
    needsAccommodation: false
  });

  const [guests, setGuests] = useState<Guest[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const weddingDate = new Date('2025-12-28T16:00:00+05:30');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    const newGuest: Guest = {
      id: Date.now().toString(),
      ...rsvpForm,
      createdAt: new Date().toISOString()
    };
    setGuests([...guests, newGuest]);
    setRsvpForm({ 
      name: '', 
      email: '', 
      phone: '',
      attending: true, 
      guests: 1, 
      message: '',
      dietaryRestrictions: '',
      needsAccommodation: false
    });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

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

  const downloadInvitation = () => {
    const invitationContent = `
WEDDING INVITATION
==================

I HAVE FOUND THE ONE WHOM MY SOUL LOVES.
- SONG OF SOLOMON 3:4

Aral & Violet

Sunday, December 28, 2025
Udupi, Karnataka, India

CHURCH NUPTIALS
Sunday, December 28, 2025
4:00 PM – 5:15 PM

RECEPTION
Sunday, December 28, 2025
7:00 PM – 11:30 PM

WITH HEARTS FULL OF JOY AND BLESSINGS FROM ABOVE, 
WE INVITE YOU TO CELEBRATE OUR UNION. 
WEAR YOUR FINEST, BRING YOUR SMILES, 
AND LET'S CHERISH THIS BEAUTIFUL EVENING.

TheVIRALWedding
A&V
12.28.2025

Please RSVP at our wedding website
    `;

    const blob = new Blob([invitationContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aral-violet-wedding-invitation.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50">
      {/* Hero Section with Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(132, 76, 89, 0.4), rgba(120, 113, 108, 0.3)), url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <Heart className="mx-auto mb-4 text-white" size={48} />
            <p className="text-white text-lg md:text-xl font-medium mb-6 italic">
              "I HAVE FOUND THE ONE WHOM MY SOUL LOVES."
            </p>
            <p className="text-cream-100 text-sm mb-8">- SONG OF SOLOMON 3:4</p>
          </div>
          
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-4 drop-shadow-lg">
              Aral <span className="text-sage-200">&</span> Violet
            </h1>
            <p className="text-xl md:text-2xl text-cream-100 mb-6 drop-shadow-md">
              Sunday, December 28, 2025 • Udupi, Karnataka, India
            </p>
          </div>

          {/* Download Invitation Button */}
          <div className="mb-12">
            <Button 
              onClick={downloadInvitation}
              className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
            >
              <Download className="mr-2" size={20} />
              Download Invitation
            </Button>
          </div>

          {/* Countdown */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl text-white mb-6 font-serif drop-shadow-md">Days To Go!</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-sage-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-olive-700">{timeLeft.days}</div>
                <div className="text-sm text-sage-600">Days</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-sage-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-olive-700">{timeLeft.hours}</div>
                <div className="text-sm text-sage-600">Hours</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-sage-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-olive-700">{timeLeft.minutes}</div>
                <div className="text-sm text-sage-600">Minutes</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-sage-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-olive-700">{timeLeft.seconds}</div>
                <div className="text-sm text-sage-600">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-olive-50 to-sage-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-olive-700 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-olive-600 to-sage-600 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Sparkles className="text-olive-600 mr-2" size={24} />
                    <h3 className="text-2xl font-serif text-olive-700">How We Met</h3>
                  </div>
                  <p className="text-sage-700 leading-relaxed">
                    Our love story began in the most unexpected way. What started as a friendship 
                    blossomed into something beautiful and everlasting. Through shared laughter, 
                    dreams, and countless memories, we discovered that we were meant to be together.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Heart className="text-olive-600 mr-2" size={24} />
                    <h3 className="text-2xl font-serif text-olive-700">The Proposal</h3>
                  </div>
                  <p className="text-sage-700 leading-relaxed">
                    Under the starlit sky, with hearts full of love and hope for the future, 
                    we decided to take the next step in our journey together. It was a moment 
                    of pure joy, surrounded by the beauty of God's creation and the promise of forever.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Calendar className="text-olive-600 mr-2" size={24} />
                    <h3 className="text-2xl font-serif text-olive-700">Our Journey</h3>
                  </div>
                  <p className="text-sage-700 leading-relaxed">
                    Every step of our relationship has been guided by faith, love, and the support 
                    of our families and friends. We've grown together, learned from each other, 
                    and built a foundation strong enough to last a lifetime.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Sparkles className="text-olive-600 mr-2" size={24} />
                    <h3 className="text-2xl font-serif text-olive-700">Forever Together</h3>
                  </div>
                  <p className="text-sage-700 leading-relaxed">
                    As we prepare to say "I do," we're filled with excitement for the adventures 
                    that await us. With God's blessing and the love of our families, we're ready 
                    to begin this new chapter as husband and wife.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-olive-700 mb-4">Wedding Details</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-olive-600 to-sage-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Church Nuptials */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="mx-auto mb-4 text-olive-600" size={48} />
                <h3 className="text-2xl font-serif text-olive-700 mb-4">Church Nuptials</h3>
                <div className="space-y-2 text-sage-700">
                  <p className="flex items-center justify-center gap-2">
                    <Calendar size={16} />
                    Sunday, December 28, 2025
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Clock size={16} />
                    4:00 PM – 5:15 PM
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    Udupi, Karnataka
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reception */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <Heart className="mx-auto mb-4 text-olive-600" size={48} />
                <h3 className="text-2xl font-serif text-olive-700 mb-4">Reception</h3>
                <div className="space-y-2 text-sage-700">
                  <p className="flex items-center justify-center gap-2">
                    <Calendar size={16} />
                    Sunday, December 28, 2025
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Clock size={16} />
                    7:00 PM – 11:30 PM
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    Udupi, Karnataka
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Celebration Message */}
      <section className="py-20 px-4 bg-gradient-to-r from-olive-600 to-olive-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">LET'S CELEBRATE</h2>
          <p className="text-lg md:text-xl text-olive-100 leading-relaxed mb-8">
            WITH HEARTS FULL OF JOY AND BLESSINGS FROM ABOVE, WE INVITE YOU TO CELEBRATE OUR UNION. 
            WEAR YOUR FINEST, BRING YOUR SMILES, AND LET'S CHERISH THIS BEAUTIFUL EVENING.
          </p>
          <div className="text-2xl md:text-3xl font-serif text-white mb-4">TheVIRALWedding</div>
          <div className="text-3xl md:text-4xl font-serif text-olive-200">A&V</div>
          <div className="text-xl md:text-2xl text-olive-200 mt-2">12.28.2025</div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-4 bg-sage-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-olive-700 mb-4">RSVP</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-olive-600 to-sage-600 mx-auto mb-6"></div>
            <p className="text-sage-700 text-lg">Please let us know if you'll be joining us for our special day</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif text-olive-700 mb-6 flex items-center gap-2">
                <Users size={24} />
                Submit Your RSVP
              </h3>
              
              {showSuccessMessage && (
                <div className="bg-sage-100 border border-sage-300 text-sage-700 px-4 py-3 rounded mb-6">
                  Thank you for your RSVP! We're excited to celebrate with you.
                </div>
              )}

              <form onSubmit={handleRSVP} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Your Name(s) *</label>
                    <Input
                      type="text"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                      placeholder="Enter your name(s)"
                      required
                      className="border-sage-300 focus:border-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                      placeholder="Enter your email"
                      required
                      className="border-sage-300 focus:border-olive-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm({...rsvpForm, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    required
                    className="border-sage-300 focus:border-olive-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Will you attend? *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={rsvpForm.attending}
                        onChange={() => setRsvpForm({...rsvpForm, attending: true})}
                        className="mr-2 text-olive-600"
                      />
                      Yes, I'll be there!
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!rsvpForm.attending}
                        onChange={() => setRsvpForm({...rsvpForm, attending: false})}
                        className="mr-2 text-olive-600"
                      />
                      Sorry, can't make it
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Number of Guests *</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm({...rsvpForm, guests: parseInt(e.target.value)})}
                      className="border-sage-300 focus:border-olive-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Need Accommodation?</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={rsvpForm.needsAccommodation}
                          onChange={() => setRsvpForm({...rsvpForm, needsAccommodation: true})}
                          className="mr-2 text-olive-600"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!rsvpForm.needsAccommodation}
                          onChange={() => setRsvpForm({...rsvpForm, needsAccommodation: false})}
                          className="mr-2 text-olive-600"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Dietary Restrictions</label>
                  <Input
                    type="text"
                    value={rsvpForm.dietaryRestrictions}
                    onChange={(e) => setRsvpForm({...rsvpForm, dietaryRestrictions: e.target.value})}
                    placeholder="Any dietary restrictions or allergies?"
                    className="border-sage-300 focus:border-olive-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">Message for the Couple</label>
                  <Textarea
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm({...rsvpForm, message: e.target.value})}
                    placeholder="Share your wishes with us..."
                    className="border-sage-300 focus:border-olive-500"
                  />
                </div>

                <Button type="submit" className="w-full bg-olive-600 hover:bg-olive-700 text-white py-3 text-lg">
                  Submit RSVP
                </Button>
              </form>

              {/* Admin Download Button (only show if there are guests) */}
              {guests.length > 0 && (
                <div className="mt-8 pt-6 border-t border-sage-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-sage-600">
                      {guests.length} RSVP{guests.length !== 1 ? 's' : ''} received
                    </p>
                    <Button 
                      onClick={downloadGuestList}
                      className="bg-sage-600 hover:bg-sage-700 text-white"
                    >
                      <Download className="mr-2" size={16} />
                      Download Guest List
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-olive-800 text-olive-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-3xl font-serif text-white mb-2">Aral & Violet</h3>
            <p className="text-olive-200">December 28, 2025 • Udupi, Karnataka, India</p>
          </div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="text-olive-400" size={20} />
            <span className="text-olive-200">Thank you for being part of our special day</span>
            <Heart className="text-olive-400" size={20} />
          </div>
          <p className="text-olive-300 text-sm">
            © 2025 TheVIRALWedding. Made with love for Aral & Violet.
          </p>
        </div>
      </footer>
    </div>
  );
}
