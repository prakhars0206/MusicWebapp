import express from 'express';
import { Innertube } from 'youtubei.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Create an instance of Innertube (YouTube's internal API client)
    const yt = await Innertube.create();
    // Search for videos using the query; limit results to 1
    console.log(query);
    const searchResults = await yt.search(`${query} audio`, { type: "video" });
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return res.status(404).json({ error: 'No video found' });
    }
    
    // The video ID can be found in the id property (check the library's docs for the exact structure)
    const videoId = searchResults.results[0].id;
    
    console.log('Found videoId:', videoId);
    res.json({ videoId });
  } catch (error) {
    console.error('Error fetching YouTube video via Innertube:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router };
