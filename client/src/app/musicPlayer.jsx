'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MusicPlayer({ currentTrack }) {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (currentTrack) {
      axios
        .get(`/api/youtube/search?query=${encodeURIComponent(currentTrack.name + ' ' + currentTrack.artists.map(a => a.name).join(' '))}`)
        .then((res) => setVideoId(res.data.videoId))
        .catch((err) => console.error('Error fetching YouTube video ID:', err));
    }
  }, [currentTrack]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {currentTrack ? (
        <>
          <img
            src={currentTrack.album?.images?.[0]?.url || '/placeholder-image.png'}
            alt="Album Cover"
            className="w-40 h-40 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-semibold">{currentTrack.name}</h2>
          <p className="text-gray-600">{currentTrack.artists?.map((artist) => artist.name).join(', ')}</p>
          
          {videoId ? (
            <iframe
              width="0"
              height="0"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&modestbranding=1`}
              frameBorder="0"
              allow="autoplay"
            ></iframe>
          ) : (
            <p className="text-gray-500">Loading audio...</p>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center">No track playing</p>
      )}
    </div>
  );
}
