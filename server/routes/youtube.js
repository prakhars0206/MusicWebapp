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
    const ytMusicController = yt.music;

    const ytmusicresults = await ytMusicController.search(`${query}`, { type: "song" });

    console.log(query);
    //console.log(ytmusicresults.songs)

    if (!ytmusicresults.songs || ytmusicresults.songs.length === 0) {
      return res.status(404).json({ error: 'No song found' });
    }

    const song = ytmusicresults.songs.contents;
    const songId = song[0]?.id;
    console.log(song[0]);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(song[1]);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(song[2]);
   

    
    // const searchResults = await yt.search(`${query} audio`, { type: "video" });
    
    // if (!searchResults.results || searchResults.results.length === 0) {
    //   return res.status(404).json({ error: 'No video found' });
    // }
    

    // //find first instance of type video otherwise shit breaks sometimes
    // const vid = searchResults.results.find(result => result.type === 'Video');
    // const videoId = vid?.id;

    
    if (!songId) {
      console.log(ytmusicresults);
      return res.status(404).json({ error: 'No song found' });
      
    }
    
    console.log('Found songId:', songId);

    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    res.json({ songId });
  } catch (error) {
    console.error('Error fetching YouTube Music song via Innertube:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router };
