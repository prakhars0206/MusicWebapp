import express from 'express';
import axios from 'axios';
import { config } from 'dotenv';

config();
const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

router.get('/search', async (req, res) => {
  const { query } = req.query;

  console.log(query);

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: `${query} audio`,
        type: 'video',
        key: YOUTUBE_API_KEY,
        maxResults: 1
      }
    });

    console.log(response)

    const video = response.data.items[0];
    if (!video) {
      return res.status(404).json({ error: 'No video found' });
    }

    res.json({ videoId: video.id.videoId });
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router };
