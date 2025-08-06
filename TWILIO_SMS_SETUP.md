# 📱 SMS Notifications Setup for Wedding Website

## Overview
Your wedding website now supports SMS notifications to family members whenever someone submits an RSVP!

## Notification Recipients
SMS notifications will be sent to:
- `+918105003858`
- `+917276700997` 
- `+919731832609`

## Setup Instructions

### Step 1: Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Complete phone verification

### Step 2: Get Twilio Credentials
1. Go to [Twilio Console](https://console.twilio.com)
2. From your dashboard, copy:
   - **Account SID** (starts with `AC`)
   - **Auth Token** (click the eye icon to reveal)

### Step 3: Get Phone Number
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number (free trial gives you one number)
3. Copy the phone number (format: `+1234567890`)

### Step 4: Configure Environment Variables

Set these in your development environment:

```bash
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_PHONE_NUMBER=+1234567890
```

**For Builder.io development environment:**
Use the DevServerControl tool to set these variables:

```javascript
// Set Twilio Account SID
DevServerControl.set_env_variable(["VITE_TWILIO_ACCOUNT_SID", "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"]);

// Set Twilio Auth Token  
DevServerControl.set_env_variable(["VITE_TWILIO_AUTH_TOKEN", "your_auth_token_here"]);

// Set Twilio Phone Number
DevServerControl.set_env_variable(["VITE_TWILIO_PHONE_NUMBER", "+1234567890"]);
```

### Step 5: Test SMS Notifications

After configuring, test the system:
1. Go to your website debug page: `/debug`
2. Check console logs when submitting an RSVP
3. Verify SMS messages are sent to the family phone numbers

## SMS Message Format

When an RSVP is submitted, family members receive:

```
🎉 NEW RSVP RECEIVED! 

👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: +1234567890
✅ Will Attend
👥 Guests: 2
👨‍👩‍👧‍👦 Side: Aral's side

💬 Message: So excited to celebrate with you!
🍽️ Dietary: Vegetarian
🏨 Needs Accommodation: Yes

TheVIRALWedding - A&V 💕
```

## Cost Information

- **Free Trial**: $15 credit (approximately 500+ SMS messages)
- **SMS Cost**: ~$0.0075 per message to Indian numbers
- **Phone Number**: ~$1/month (after trial)

## Security Notes

- ✅ Auth token is kept secure in environment variables
- ✅ SMS service fails gracefully - RSVP still works if SMS fails
- ✅ Phone numbers are not exposed in client code
- ✅ SMS is optional - website works without it

## Troubleshooting

### SMS Not Sending?
1. Check Twilio console for error logs
2. Verify phone number format includes country code
3. Ensure Twilio account has sufficient balance
4. Check browser console for error messages

### Phone Number Issues?
- Indian numbers must include `+91` prefix
- Remove any spaces or special characters
- Format: `+919876543210`

### Environment Variables Not Working?
- Ensure variables start with `VITE_`
- Restart development server after adding variables
- Check browser dev tools → Console for configuration status

## Benefits

✅ **Instant Notifications**: Family gets notified immediately when someone RSVPs
✅ **Complete Details**: All RSVP information included in message
✅ **Reliable**: Uses professional Twilio service
✅ **Optional**: Website works perfectly without SMS configured
✅ **Secure**: No sensitive data exposed to users
