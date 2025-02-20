import express from 'express';
import { Innertube } from 'youtubei.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  let { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const explicit = query.slice(-5).trim();
    
    console.log(explicit);
    query = query.slice(0,-5).trim();
    

    const yt = await Innertube.create();
    const ytMusicController = yt.music;

    const ytmusicresults = await ytMusicController.search(`${query}`, { type: "song" });

    console.log(query);
    console.log("--------");

    const songs = ytmusicresults.songs?.contents;
    let selectedSong = null;
    if (songs && songs.length > 0) {
      // Normalize query for matching
      const lowerQuery = query.toLowerCase();

      const songTitle = songs[0].title || '';
      console.log(`${songTitle.toLowerCase()}: ${(lowerQuery.includes(songTitle.toLowerCase()))}`);
      if (lowerQuery.includes(songTitle.toLowerCase())) {
        if ((explicit == 'true' && songs[0].badges != null) ||(explicit == 'false' && songs[0].badges == null)){
          
          selectedSong = songs[0];
        
        } else if (explicit == 'true' && songs[0].badges == null) {

          const nextSongTitle = songs[1].title || '';
          if (lowerQuery.includes(nextSongTitle.toLowerCase())){
            if ( songs[1].badges[0] != null){
              console.log("2nd song chosen")
              selectedSong = songs[1];
            }
          }
        }
        
      }

      // just for testing purposes to see other results
      for (let i = 1; i < Math.min(5, songs.length); i++) {

        const songTitle = songs[i].title || '';
        console.log(`${songTitle.toLowerCase()}: ${(lowerQuery.includes(songTitle.toLowerCase()))}`);
        
      }
    }

    // If we found a matching song in YouTube Music results, use its id.
    if (selectedSong && selectedSong.id) {
      console.log('Found song via YouTube Music:', selectedSong.id);
      console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
      console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
      console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
      console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
      console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
      console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");

      return res.json({ songId: selectedSong.id });
    }

    // Otherwise, fall back to a normal YouTube search for audio
    const searchResults = await yt.search(`${query} audio`, { type: "video" });
    if (!searchResults.results || searchResults.results.length === 0) {
      return res.status(404).json({ error: 'No video found' });
    }
    // Find the first result of type 'Video'
    const vid = searchResults.results.find(result => result.type === 'Video');
    const videoId = vid?.id;
    if (!videoId) {
      console.log(searchResults);
      return res.status(404).json({ error: 'No video found' });
    }
    console.log('Fallback videoId:', videoId);
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
    console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////////////////");

    res.json({ songId: videoId });
   

  } catch (error) {
    console.error('Error fetching YouTube Music song via Innertube:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router };
