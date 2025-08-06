import twilio from 'twilio';

// Twilio configuration - get these from your Twilio dashboard
const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

// Family phone numbers to notify
const NOTIFICATION_NUMBERS = [
  '+918105003858',
  '+917276700997', 
  '+919731832609'
];

// Initialize Twilio client
let twilioClient: any = null;

try {
  if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
    console.log('Twilio SMS service initialized');
  } else {
    console.log('Twilio credentials not configured - SMS notifications disabled');
  }
} catch (error) {
  console.warn('Failed to initialize Twilio:', error);
}

export interface RSVPDetails {
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  guests: number;
  side: 'groom' | 'bride';
  message?: string;
  dietaryRestrictions?: string;
  needsAccommodation: boolean;
}

export const sendRSVPNotification = async (rsvpDetails: RSVPDetails): Promise<boolean> => {
  if (!twilioClient || !fromNumber) {
    console.log('SMS service not configured - skipping notifications');
    return false;
  }

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

  const results = [];
  
  for (const phoneNumber of NOTIFICATION_NUMBERS) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber
      });
      
      console.log(`SMS sent successfully to ${phoneNumber}:`, result.sid);
      results.push({ phoneNumber, success: true, sid: result.sid });
    } catch (error) {
      console.error(`Failed to send SMS to ${phoneNumber}:`, error);
      results.push({ phoneNumber, success: false, error: error });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`SMS notifications: ${successCount}/${NOTIFICATION_NUMBERS.length} sent successfully`);
  
  return successCount > 0;
};

export const testSMSService = async (): Promise<boolean> => {
  if (!twilioClient || !fromNumber) {
    console.log('SMS service not configured');
    return false;
  }

  const testMessage = `🧪 SMS Service Test - TheVIRALWedding System
  
This is a test message to verify SMS notifications are working.
  
Timestamp: ${new Date().toLocaleString()}
  
A&V Wedding Website 💕`;

  try {
    // Send test message to first number only
    const result = await twilioClient.messages.create({
      body: testMessage,
      from: fromNumber,
      to: NOTIFICATION_NUMBERS[0]
    });
    
    console.log('Test SMS sent successfully:', result.sid);
    return true;
  } catch (error) {
    console.error('Test SMS failed:', error);
    return false;
  }
};

export const isSMSConfigured = (): boolean => {
  return !!(accountSid && authToken && fromNumber);
};
