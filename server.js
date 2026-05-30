const express = require('express');
const path = require('path');
const fs = require('fs');

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

app.get('/api/logs', (req, res) => {
  res.json(logs);
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
