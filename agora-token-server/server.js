const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 8000;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

if (!APP_ID || !APP_CERTIFICATE) {
    console.error('Missing APP_ID or APP_CERTIFICATE in .env file');
    process.exit(1);
}

app.use(express.json());

app.post('/generate-token', (req, res) => {
    const { channelName, uid } = req.body;

    console.log(`Received request with channelName: ${channelName} and uid: ${uid}`);

    if (!channelName || !uid) {
        return res.status(400).json({ error: 'Channel name and UID are required' });
    }

    try {
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );

        console.log('Generated Token:', token);
        res.json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
