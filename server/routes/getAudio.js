import ytdlp from 'yt-dlp-exec';
import ffmpeg from 'ffmpeg-static';

router.get('/audio', async (req, res) => {
  try {
    const { videoId } = req.query;
    const result = await ytdlp(`https://www.youtube.com/watch?v=${videoId}`, {
      dumpSingleJson: true,
      format: 'bestaudio',
      ffmpegLocation: ffmpeg
    });
    
    res.json({ audioUrl: result.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get audio stream' });
  }
});