'use client';
import { useState, useEffect } from "react";

export default function ShowTracks({ selectedAlbum, onBack, onTrackSelect, setAlbumImg, albumImg }) {
    const [trackList, setTrackList] = useState([]);
    const [loadingTracks, setLoadingTracks] = useState(false);
  
    const fetchTracks = async (albumId) => {
      try {
        setLoadingTracks(true);
        const response = await fetch(
          `http://localhost:5001/api/songs?query=${encodeURIComponent(albumId)}`,
          { method: 'GET' }
        );
        const data = await response.json();
        setTrackList(data.trackList || []);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoadingTracks(false);
      }
    };
  
    useEffect(() => {
      if (selectedAlbum) {
        fetchTracks(selectedAlbum.id);
      }
      return () => {
        setTrackList([]); // Reset track list when component unmounts
      };
    }, [selectedAlbum]);
  
    const formatDuration = (durationMs) => {
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  
    if (!selectedAlbum) return null;
  
    return (
      <div>
        <button onClick={onBack} className="text-blue-500 mb-4">
          Back to Albums
        </button>
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
          <div className="flex">
            <img
              src={selectedAlbum.images?.[0]?.url || '/placeholder-image.png'}
              alt={`${selectedAlbum.name || 'Album'} Cover`}
              className="w-64 h-64 object-cover rounded-md mr-6"
            />
            <div>
              <h3 className="text-3xl font-bold mb-4">{selectedAlbum.name || 'Unknown Album'}</h3>
              <p className="text-gray-600">
                {selectedAlbum.artists?.map((artist) => artist.name).join(', ') ||
                  'Unknown Artists'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Release Date: {selectedAlbum.release_date || 'Unknown'}
              </p>
              <p className="text-sm text-gray-500">
                Total Tracks: {selectedAlbum.total_tracks || 'N/A'}
              </p>
            </div>
          </div>
  
          {loadingTracks ? (
            <div>
              <img className="justify-center" src="./spinner.svg" alt="Loading spinner" />
            </div>
          ) : trackList.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-2">Tracklist:</h4>
              <ul className="divide-y divide-gray-200">
                {trackList.map((track, index) => (
                  <li
                    key={track.id || index}
                    className="py-3 flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      onTrackSelect(track); 
                      setAlbumImg(albumImg);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-4">{index + 1}</span>
                      <p className="font-medium">{track.name}</p>
                    </div>
                    <span className="text-gray-500">{formatDuration(track.duration_ms)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-lg">No tracks available for this album.</p>
          )}
        </div>
      </div>
    );
  }
  