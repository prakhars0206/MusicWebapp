import express from 'express';
import { Innertube } from 'youtubei.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {

    const yt = await Innertube.create();

    console.log(query);
    const searchResults = await yt.search(`${query} audio`, { type: "video" });
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return res.status(404).json({ error: 'No video found' });
    }
    

    //find first instance of type video otherwise shit breaks sometimes
    const vid = searchResults.results.find(result => result.type === 'Video');
    const videoId = vid?.id;

    
    if (!videoId) {
      console.log(searchResults);
      return res.status(404).json({ error: 'No video found' });
      
    }
    
    console.log('Found videoId:', videoId);
    res.json({ videoId });
  } catch (error) {
    console.error('Error fetching YouTube video via Innertube:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router };
