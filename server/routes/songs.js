import fetch from 'node-fetch';
import express from 'express';
import {getAuth} from '../accessToken.js';
const router = express.Router();

router.get('/', async (req, res)=> {

    const { query } = req.query; // Query from the frontend

    if (!query) return res.status(400).send({ error: 'Search query is required' });

    try{
        const token = await getAuth();

        // Get Artist Info
        const tracksRequest = await fetch(`https://api.spotify.com/v1/albums/${query}/tracks?limit=50`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        if (!tracksRequest.ok) {
            const error = await tracksRequest.json();
            console.error('Spotify API Error:', error);
            return res.status(tracksRequest.status).send({ error });
          }
    
        const trackData = await tracksRequest.json();

        if (!trackData ) {
            return res.status(404).send({ error: 'Artist not found' });
        }

        
        res.send({trackList: trackData.items, totalTracks: trackData.total});
    } catch(error) {
        console.error('Error fetching from Spotify API:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

export {router};