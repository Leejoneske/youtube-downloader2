const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route to get video info
app.post('/api/getVideoInfo', async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const details = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds,
    };

    if (info.videoDetails.isPrivate) {
      return res.json({ loginRequired: true });
    }

    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

// Route to download video
app.get('/api/downloadVideo', async (req, res) => {
  const { videoUrl } = req.query;
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(videoUrl, { format: 'mp4' }).pipe(res);
});

// Route to download audio
app.get('/api/downloadAudio', async (req, res) => {
  const { videoUrl } = req.query;
  res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
  ytdl(videoUrl, { filter: 'audioonly' }).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
