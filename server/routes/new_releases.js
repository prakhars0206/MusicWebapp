import fetch from 'node-fetch';
import express from 'express';
import { getAuth } from '../accessToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const token = await getAuth();

    // Fetch new releases from Spotify
    const releaseReq = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!releaseReq.ok) {
      const error = await releaseReq.json();
      console.error('Spotify API Error:', error);
      return res.status(releaseReq.status).send({ error });
    }

    const releaseData = await releaseReq.json();

    res.send({ newReleases: releaseData.albums.items });
  } catch (error) {
    console.error('Error fetching from Spotify API:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export { router };
