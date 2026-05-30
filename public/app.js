const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const statusText = document.getElementById('statusText');
const faceCountEl = document.getElementById('faceCount');
const detailsList = document.getElementById('detailsList');
const logContainer = document.getElementById('logContainer');
const startButton = document.getElementById('startButton');
const sessionIdLabel = document.getElementById('sessionId');

let model = null;
let cameraStream = null;
let running = false;
let sessionId = `sesi-${Date.now()}`;
let lastEventAt = 0;
let lastStatus = '';

async function initCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = cameraStream;
    await video.play();
    overlay.width = video.videoWidth || 640;
    overlay.height = video.videoHeight || 480;
    statusText.textContent = 'Kamera siap. Klik "Mulai Pengawasan".';
    sessionIdLabel.textContent = sessionId;
  } catch (error) {
    statusText.textContent = 'Gagal mengakses kamera. Izinkan kamera dan muat ulang halaman.';
    console.error(error);
  }
}

async function loadModel() {
  try {
    statusText.textContent = 'Memuat model AI...';
    model = await blazeface.load();
    statusText.textContent = 'Model AI siap. Klik tombol untuk mulai.';
  } catch (error) {
    statusText.textContent = 'Gagal memuat model AI. Periksa koneksi internet.';
    console.error(error);
  }
}

function updateLog(message, type = 'info', screenshot = null) {
  const item = document.createElement('div');
  item.className = 'log-item';
  item.innerHTML = `
    <b>${new Date().toLocaleTimeString('id-ID')} — ${type.toUpperCase()}</b>
    <div>${message}</div>
  `;
  logContainer.prepend(item);

  if (screenshot) {
    const image = new Image();
    image.src = screenshot;
    image.alt = 'Screenshot bukti';
    image.style.maxWidth = '100%';
    image.style.borderRadius = '12px';
    image.style.marginTop = '10px';
    item.appendChild(image);
  }
}

async function sendLog(eventType, message, screenshot = null) {
  try {
    const payload = {
      sessionId,
      eventType,
      message,
      screenshot,
      timestamp: new Date().toISOString(),
    };

    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Gagal mengirim log:', error);
  }
}

function captureScreenshot() {
  const canvas = document.createElement('canvas');
  canvas.width = overlay.width;
  canvas.height = overlay.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

function drawBoxes(predictions) {
  const ctx = overlay.getContext('2d');
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';

  predictions.forEach((prediction) => {
    const [x1, y1] = prediction.topLeft;
    const [x2, y2] = prediction.bottomRight;
    const width = x2 - x1;
    const height = y2 - y1;

    ctx.fillRect(x1, y1, width, height);
    ctx.strokeRect(x1, y1, width, height);
  });
}

async function detectLoop() {
  if (!running || !model) {
    return;
  }

  const predictions = await model.estimateFaces(video, false);
  const faceCount = predictions.length;
  faceCountEl.textContent = faceCount;
  drawBoxes(predictions);

  let status = 'Aman - hanya 1 wajah terdeteksi.';
  let eventType = 'info';
  let message = 'Sesi pengawasan berjalan normal.';
  let screenshot = null;

  if (faceCount === 0) {
    status = 'Peringatan: wajah tidak terdeteksi.';
    eventType = 'warning';
    message = 'Tidak ada wajah terdeteksi dalam kamera.';
  } else if (faceCount > 1) {
    status = 'Bahaya: lebih dari satu wajah terdeteksi.';
    eventType = 'critical';
    message = 'Terjadi deteksi lebih dari satu wajah dalam area kamera.';
    screenshot = captureScreenshot();
  }

  statusText.textContent = status;

  const now = Date.now();
  if (status !== lastStatus || now - lastEventAt > 5000) {
    lastStatus = status;
    lastEventAt = now;
    updateLog(message, eventType, screenshot);
    await sendLog(eventType, message, screenshot);
  }

  requestAnimationFrame(detectLoop);
}

startButton.addEventListener('click', async () => {
  if (!cameraStream) {
    await initCamera();
  }
  if (!model) {
    await loadModel();
  }
  running = true;
  startButton.disabled = true;
  startButton.textContent = 'Pengawasan Berjalan';
  updateLog('Sesi pengawasan dimulai.', 'info');
  await sendLog('info', 'Sesi pengawasan dimulai.');
  detectLoop();
});

window.addEventListener('load', async () => {
  await initCamera();
  await loadModel();
});
