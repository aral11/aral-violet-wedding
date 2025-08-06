import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Camera, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  message?: string;
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
    attending: true,
    guests: 1,
    message: ''
  });

  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'John & Sarah Smith', email: 'john@example.com', attending: true, guests: 2 },
    { id: '2', name: 'Michael Johnson', email: 'michael@example.com', attending: true, guests: 1 },
    { id: '3', name: 'Emily & David Wilson', email: 'emily@example.com', attending: false, guests: 2 },
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

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
      ...rsvpForm
    };
    setGuests([...guests, newGuest]);
    setRsvpForm({ name: '', email: '', attending: true, guests: 1, message: '' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedPhotos([...uploadedPhotos, ...fileUrls]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-600/20 to-sage-600/20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <Heart className="mx-auto mb-4 text-burgundy-600" size={48} />
            <p className="text-sage-700 text-lg md:text-xl font-medium mb-6 italic">
              "I HAVE FOUND THE ONE WHOM MY SOUL LOVES."
            </p>
            <p className="text-sage-600 text-sm mb-8">- SONG OF SOLOMON 3:4</p>
          </div>
          
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-serif text-burgundy-700 mb-4">
              Aral <span className="text-sage-600">&</span> Violet
            </h1>
            <p className="text-xl md:text-2xl text-sage-700 mb-6">
              Sunday, December 28, 2025 • Udupi, Karnataka, India
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl text-burgundy-700 mb-6 font-serif">Days To Go!</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-sage-200">
                <div className="text-2xl md:text-3xl font-bold text-burgundy-700">{timeLeft.days}</div>
                <div className="text-sm text-sage-600">Days</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-sage-200">
                <div className="text-2xl md:text-3xl font-bold text-burgundy-700">{timeLeft.hours}</div>
                <div className="text-sm text-sage-600">Hours</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-sage-200">
                <div className="text-2xl md:text-3xl font-bold text-burgundy-700">{timeLeft.minutes}</div>
                <div className="text-sm text-sage-600">Minutes</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-sage-200">
                <div className="text-2xl md:text-3xl font-bold text-burgundy-700">{timeLeft.seconds}</div>
                <div className="text-sm text-sage-600">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy-700 mb-4">Wedding Details</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-burgundy-600 to-sage-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Church Nuptials */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="mx-auto mb-4 text-burgundy-600" size={48} />
                <h3 className="text-2xl font-serif text-burgundy-700 mb-4">Church Nuptials</h3>
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
                <Heart className="mx-auto mb-4 text-burgundy-600" size={48} />
                <h3 className="text-2xl font-serif text-burgundy-700 mb-4">Reception</h3>
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
      <section className="py-20 px-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">LET'S CELEBRATE</h2>
          <p className="text-lg md:text-xl text-burgundy-100 leading-relaxed mb-8">
            WITH HEARTS FULL OF JOY AND BLESSINGS FROM ABOVE, WE INVITE YOU TO CELEBRATE OUR UNION. 
            WEAR YOUR FINEST, BRING YOUR SMILES, AND LET'S CHERISH THIS BEAUTIFUL EVENING.
          </p>
          <div className="text-2xl md:text-3xl font-serif text-white mb-4">TheVIRALWedding</div>
          <div className="text-3xl md:text-4xl font-serif text-burgundy-200">A&V</div>
          <div className="text-xl md:text-2xl text-burgundy-200 mt-2">12.28.2025</div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-20 px-4 bg-sage-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy-700 mb-4">RSVP</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-burgundy-600 to-sage-600 mx-auto mb-6"></div>
            <p className="text-sage-700 text-lg">Please let us know if you'll be joining us for our special day</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* RSVP Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif text-burgundy-700 mb-6 flex items-center gap-2">
                  <Users size={24} />
                  Submit Your RSVP
                </h3>
                <form onSubmit={handleRSVP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Your Name(s)</label>
                    <Input
                      type="text"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                      placeholder="Enter your name(s)"
                      required
                      className="border-sage-300 focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                      placeholder="Enter your email"
                      required
                      className="border-sage-300 focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Will you attend?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={rsvpForm.attending}
                          onChange={() => setRsvpForm({...rsvpForm, attending: true})}
                          className="mr-2 text-burgundy-600"
                        />
                        Yes, I'll be there!
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!rsvpForm.attending}
                          onChange={() => setRsvpForm({...rsvpForm, attending: false})}
                          className="mr-2 text-burgundy-600"
                        />
                        Sorry, can't make it
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Number of Guests</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm({...rsvpForm, guests: parseInt(e.target.value)})}
                      className="border-sage-300 focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">Message (Optional)</label>
                    <Textarea
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm({...rsvpForm, message: e.target.value})}
                      placeholder="Share your wishes with us..."
                      className="border-sage-300 focus:border-burgundy-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    Submit RSVP
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Guest List */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif text-burgundy-700 mb-6">Guest List</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {guests.map((guest) => (
                    <div key={guest.id} className="p-4 border border-sage-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sage-800">{guest.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          guest.attending 
                            ? 'bg-sage-100 text-sage-700' 
                            : 'bg-burgundy-100 text-burgundy-700'
                        }`}>
                          {guest.attending ? 'Attending' : 'Not Attending'}
                        </span>
                      </div>
                      <p className="text-sm text-sage-600">{guest.email}</p>
                      <p className="text-sm text-sage-600">Guests: {guest.guests}</p>
                      {guest.message && (
                        <p className="text-sm text-sage-700 italic mt-2">"{guest.message}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy-700 mb-4">Our Memories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-burgundy-600 to-sage-600 mx-auto mb-6"></div>
            <p className="text-sage-700 text-lg">Share your photos with us to make our wedding album complete</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg mb-8">
            <CardContent className="p-8 text-center">
              <Camera className="mx-auto mb-4 text-burgundy-600" size={48} />
              <h3 className="text-2xl font-serif text-burgundy-700 mb-4">Upload Your Photos</h3>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button className="bg-sage-600 hover:bg-sage-700 text-white">
                  Choose Photos
                </Button>
              </label>
            </CardContent>
          </Card>

          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={photo}
                    alt={`Uploaded photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {uploadedPhotos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sage-600">No photos uploaded yet. Be the first to share your memories!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-burgundy-800 text-burgundy-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-3xl font-serif text-white mb-2">Aral & Violet</h3>
            <p className="text-burgundy-200">December 28, 2025 • Udupi, Karnataka, India</p>
          </div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="text-burgundy-400" size={20} />
            <span className="text-burgundy-200">Thank you for being part of our special day</span>
            <Heart className="text-burgundy-400" size={20} />
          </div>
          <p className="text-burgundy-300 text-sm">
            © 2025 TheVIRALWedding. Made with love for Aral & Violet.
          </p>
        </div>
      </footer>
    </div>
  );
}
