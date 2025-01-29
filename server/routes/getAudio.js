import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execPromise = promisify(exec);

router.get('/audio', async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    const command = `yt-dlp -f bestaudio --get-url "https://www.youtube.com/watch?v=${videoId}"`;
    const { stdout } = await execPromise(command);
    const audioUrl = stdout.trim();

    res.json({ audioUrl });
  } catch (error) {
    console.error('Error fetching audio URL:', error);
    res.status(500).json({ error: 'Failed to get audio stream' });
  }
});

export { router };
