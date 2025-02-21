import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import ffmpeg from 'ffmpeg-static';
import path from 'path';

const router = express.Router();
const execPromise = promisify(exec);

router.get('/audio', async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    // Verify ffmpeg path exists
    if (!ffmpeg) {
      throw new Error('FFmpeg binary not found');
    }

    const command = `./node_modules/.bin/yt-dlp -f bestaudio --get-url "https://www.youtube.com/watch?v=${videoId}"`;
    
    // Execute command with modified PATH
    const { stdout } = await execPromise(command, {
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:${path.dirname(ffmpeg)}`
      }
    });

    const audioUrl = stdout.trim();
    res.json({ audioUrl });

  } catch (error) {
    console.error('Error fetching audio URL:', error);
    res.status(500).json({ 
      error: 'Failed to get audio stream',
      details: error.message 
    });
  }
});

export { router };