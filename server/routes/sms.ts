import { Request, Response } from 'express';

// SMS notification endpoint
export const sendRSVPSMSNotification = async (req: Request, res: Response) => {
  try {
    const { rsvpDetails } = req.body;
    
    // Log the RSVP details for now
    console.log('📱 RSVP SMS Notification Request:', {
      name: rsvpDetails.name,
      email: rsvpDetails.email,
      attending: rsvpDetails.attending,
      side: rsvpDetails.side,
      guests: rsvpDetails.guests
    });

    // For now, simulate SMS sending since we don't have Twilio configured server-side
    // In production, you would integrate with a SMS service here
    
    const notificationNumbers = [
      '+918105003858',
      '+917276700997', 
      '+919731832609'
    ];

    const attendingText = rsvpDetails.attending ? '✅ Will Attend' : '❌ Cannot Attend';
    const sideText = rsvpDetails.side === 'groom' ? "Aral's side" : "Violet's side";
    
    const message = `🎉 NEW RSVP RECEIVED! 

👤 Name: ${rsvpDetails.name}
📧 Email: ${rsvpDetails.email}
📱 Phone: ${rsvpDetails.phone}
${attendingText}
👥 Guests: ${rsvpDetails.guests}
👨‍👩‍👧‍👦 Side: ${sideText}

${rsvpDetails.message ? `💬 Message: ${rsvpDetails.message}` : ''}
${rsvpDetails.dietaryRestrictions ? `🍽️ Dietary: ${rsvpDetails.dietaryRestrictions}` : ''}
${rsvpDetails.needsAccommodation ? '🏨 Needs Accommodation: Yes' : ''}

TheVIRALWedding - A&V 💕`;

    console.log('📱 SMS Message that would be sent to', notificationNumbers.length, 'numbers:');
    console.log(message);
    console.log('📱 Recipients:', notificationNumbers);

    // Return success response
    res.json({
      success: true,
      message: 'SMS notifications would be sent in production',
      recipients: notificationNumbers.length,
      // In development, just log instead of actually sending
      development: true
    });

  } catch (error) {
    console.error('SMS notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS notifications',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// SMS test endpoint
export const testSMS = async (req: Request, res: Response) => {
  try {
    console.log('📱 SMS Test Request');
    
    const testMessage = `🧪 SMS Service Test - TheVIRALWedding System
    
This is a test message to verify SMS notifications are working.
    
Timestamp: ${new Date().toLocaleString()}
    
A&V Wedding Website 💕`;

    console.log('📱 Test SMS Message:');
    console.log(testMessage);
    console.log('📱 Would be sent to: +918105003858');

    res.json({
      success: true,
      message: 'Test SMS would be sent in production',
      development: true
    });

  } catch (error) {
    console.error('SMS test error:', error);
    res.status(500).json({
      success: false,
      error: 'SMS test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
