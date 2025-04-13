const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is alive!');
});

app.post('/api/start-challenge', (req, res) => {
  const containerName = `instance_${Date.now()}`;
  const port = 8081 + Math.floor(Math.random() * 1000);

  const cmd = `docker run --rm -d --name ${containerName} -p ${port}:80 instance_1`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      return res.status(500).json({ error: 'Failed to start container' });
    }
    return res.json({
      message: 'Challenge started',
      containerId: stdout.trim(),
      accessUrl: `http://localhost:${port}`
    });
  });
});

app.post('/api/stop-challenge', (req, res) => {
  const { containerId } = req.body;
  if (!containerId) return res.status(400).json({ error: 'Container ID required' });

  const cmd = `docker stop ${containerId}`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error stopping container: ${stderr}`);
      return res.status(500).json({ error: 'Failed to stop container' });
    }
    return res.json({ message: 'Challenge stopped' });
  });
});

app.get('/api/status', (req, res) => {
  exec(`docker ps --filter "ancestor=instance_1" --format "{{.ID}} {{.Names}} {{.Ports}}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get status' });
    }

    const lines = stdout.trim().split('\n');
    if (lines.length === 0 || !stdout.trim()) {
      return res.json({ running: false });
    }

    const parts = lines[0].split(' ');
    const containerId = parts[0];
    const portMatch = stdout.match(/0\.0\.0\.0:(\d+)->80/);
    const port = portMatch ? portMatch[1] : null;

    res.json({
      running: true,
      containerId,
      accessUrl: `http://localhost:${port}`
    });
  });
});

// Flag submission route
app.post('/api/submit-flag', (req, res) => {
  const { flag } = req.body;

  // Replace with your actual flag
  const correctFlag = "FLAG{easy_flag_for_testing_123}";

  if (flag === correctFlag) {
    return res.json({ message: "✅ Correct flag! Well done." });
  } else {
    return res.json({ message: "❌ Incorrect flag. Try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
