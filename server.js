const express = require('express');
const path = require('path');
const fs = require('fs');

const http = require('http');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;
const evidenceDir = path.join(__dirname, 'evidence');
const logsFile = path.join(__dirname, 'logs.json');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir);
}

let logs = [];
if (fs.existsSync(logsFile)) {
  try {
    logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
  } catch (error) {
    console.warn('Tidak dapat memuat logs.json, membuat ulang log baru.');
    logs = [];
  }
}

app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const cameraConfigFile = path.join(__dirname, 'camera.json');
let cameraConfig = {};
if (fs.existsSync(cameraConfigFile)) {
  try {
    cameraConfig = JSON.parse(fs.readFileSync(cameraConfigFile, 'utf8')) || {};
  } catch (err) {
    cameraConfig = {};
  }
}

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.get('/api/camera', (req, res) => {
  const url = cameraConfig.url || process.env.CAMERA_URL || null;
  res.json({ url });
});

app.post('/api/camera', (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'Missing url' });
  cameraConfig.url = url;
  try {
    fs.writeFileSync(cameraConfigFile, JSON.stringify(cameraConfig, null, 2));
  } catch (err) {
    console.error('Gagal menyimpan konfigurasi kamera:', err);
    return res.status(500).json({ error: 'Gagal menyimpan konfigurasi' });
  }
  res.json({ success: true, url });
});

// Proxy stream endpoint for static camera (MJPEG / HTTP streams)
app.get('/camera/stream', (req, res) => {
  const cameraUrl = cameraConfig.url || process.env.CAMERA_URL;
  if (!cameraUrl) return res.status(404).send('Camera URL not configured');

  try {
    const client = cameraUrl.startsWith('https') ? https : http;
    const proxyReq = client.get(cameraUrl, (proxyRes) => {
      // copy status and headers
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Error proxying camera stream:', err.message);
      res.status(502).send('Gagal mengambil stream kamera');
    });
  } catch (err) {
    console.error('Exception proxy camera:', err);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/log', (req, res) => {
  const { eventType, message, screenshot, sessionId, timestamp } = req.body;
  const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const savedLog = {
    id,
    sessionId: sessionId || 'default-session',
    eventType: eventType || 'info',
    message: message || '',
    timestamp: timestamp || new Date().toISOString(),
  };

  if (screenshot) {
    const imageData = screenshot.replace(/^data:image\/png;base64,/, '');
    const imagePath = path.join(evidenceDir, `${id}.png`);
    try {
      fs.writeFileSync(imagePath, imageData, 'base64');
      savedLog.screenshot = `evidence/${id}.png`;
    } catch (error) {
      console.error('Gagal menyimpan screenshot:', error);
    }
  }

  logs.unshift(savedLog);
  try {
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Gagal menyimpan logs.json:', error);
  }

  res.status(201).json({ success: true, log: savedLog });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
