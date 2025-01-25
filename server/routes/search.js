import fetch from 'node-fetch';
import express from 'express';
import {getAuth} from '../accessToken.js';
const router = express.Router();
// import { config } from 'dotenv';

// // Load environment variables
// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;

// // Middleware to get Spotify access token
// let accessToken = '';
// let tokenExpiry = 0;
// const getAccessToken = async () => {
//   const now = Date.now()

//   try{
//     if (!accessToken || now >= tokenExpiry) {
//       const authParams = new URLSearchParams();
//       authParams.append('grant_type', 'client_credentials');
//       authParams.append('client_id', clientId);
//       authParams.append('client_secret', clientSecret);
  
//       const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: authParams,
//       });
//       const data = await response.json();
//       accessToken = data.access_token;
//       tokenExpiry = now + data.expires_in * 1000;
//     }
//   }catch(error){
//     console.error("Error getting token", error);
//   }
  
//   return accessToken;
// };

// Route: Search for artists and their albums
router.get('/', async (req, res) => {
  const { query } = req.query; // Query from the frontend

  if (!query) return res.status(400).send({ error: 'Search query is required' });

  try {
    const token = await getAuth();

    // Get Artist Info
    const artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const artistData = await artistResponse.json();
    

    // Check if the response contains the artists object
    if (!artistData || !artistData.artists || !artistData.artists.items || artistData.artists.items.length === 0) {
      return res.status(404).send({ error: 'Artist not found' });
    }

    const artist = artistData.artists.items[0];

    // Get Albums by Artist
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
