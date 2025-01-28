import fetch from 'node-fetch';
import express from 'express';
import {getAuth} from '../accessToken.js';
const router = express.Router();


router.get('/', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).send({ error: 'Search query is required' });

  try {
    const token = await getAuth();

    // artist info
    const artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const artistData = await artistResponse.json();
    

    // check if response contains the artists object
    if (!artistData || !artistData.artists || !artistData.artists.items || artistData.artists.items.length === 0) {
      return res.status(404).send({ error: 'Artist not found' });
    }

    const artist = artistData.artists.items[0];

    //get albums
    const albumResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&market=US&limit=50`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const albumData = await albumResponse.json();

    // Check if the response contains the albums array
    if (!albumData || !albumData.items || albumData.items.length === 0) {
      return res.status(404).send({ error: 'No albums found for this artist' });
    }
    res.send({ artist: artist.name, albums: albumData.items, artist_img: artist.images });
  } catch (error) {
    console.error('Error fetching from Spotify API:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export {router};
