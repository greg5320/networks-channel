require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { TextEncoder, TextDecoder } = require('util');
const { Hamming } = require('./ham');

const P_ERROR = 0.1;
const P_LOSS = 0.02;
const TRANSPORT_URL = process.env.TRANSPORT_URL;
const CHANNEL_PORT = parseInt(process.env.CHANNEL_PORT, 10);

const app = express();
app.use(bodyParser.json());

app.post('/segment', async (req, res) => {
  const segment = req.body;
  try {
    if (Math.random() < P_LOSS) {
      return res.status(200).json({ error: 'Segment lost (simulated)' });
    }

    const text = segment.payload;
    const bytes = new TextEncoder().encode(text);
    let bitStream = '';
    for (let b of bytes) {
      const bits = b.toString(2).padStart(8, '0');
      bitStream += Hamming.coding(bits.slice(0,4));
      bitStream += Hamming.coding(bits.slice(4,8));
    }

    const words7 = bitStream.match(/.{1,7}/g) || [];
    const errored = words7.map(w => {
      let bits = w.split('');
      if (Math.random() < P_ERROR) {
        const i = Math.floor(Math.random() * bits.length);
        bits[i] = bits[i] === '0' ? '1' : '0';
      }
      return bits.join('');
    });
    const decodedBits = errored.map(w => Hamming.decoding(w)).join('');
    const byteChunks = decodedBits.match(/.{1,8}/g) || [];
    const bytesOut = byteChunks.map(b => parseInt(b,2));
    const payloadOut = new TextDecoder().decode(Uint8Array.from(bytesOut));

    const outSegment = { 
      payload: payloadOut,
      username: segment.username,
      sendTime: segment.sendTime,
      segmentNumber: segment.segmentNumber,
      totalSegments: segment.totalSegments
    };
    try {
      await axios.post(TRANSPORT_URL, outSegment);
    } catch (forwardErr) {
      console.warn('Warning: cannot forward to transport:', forwardErr.message);
    }

    res.status(200).json(outSegment);
  } catch (err) {
    console.error('Channel error:', err);
    res.status(500).json({ error: err.message || 'Internal channel error' });
  }
});

app.listen(CHANNEL_PORT, () => console.log(`Channel listening on port ${CHANNEL_PORT}`));
