'use client';
import { useState } from "react";

export default function ShowAlbums({ results }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null); 
  const [trackList, setTrackList] = useState([]); 
  const [loadingTracks, setLoadingTracks] = useState(false);
  
  const artistName = results?.artist || 'Unknown Artist'; 
  const artistImage = results?.artist_img?.[0]?.url || null;

  // Determine if the user has performed a search
  function hasSearched() {
    return Object.keys(results).length > 0;
  }
  console.log(results);
  console.log(hasSearched());

  // Fetch tracks for the selected album
  const fetchTracks = async (albumId) => {
    try {
      setLoadingTracks(true);
      const response = await fetch(`http://localhost:5001/api/songs?query=${encodeURIComponent(albumId)}`, {
        method: 'GET',
      });
      const data = await response.json();
      setTrackList(data.trackList || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoadingTracks(false);
    }
  };

  // Handler for selecting an album
  const handleAlbumClick = async (album) => {
    setSelectedAlbum(album);
    await fetchTracks(album.id);
  };

  // Handler for returning to album list
  const handleBack = () => {
    setSelectedAlbum(null);
    setTrackList([]);
  };

  // Function to render the track list
  const renderTrackList = () => {
    if (loadingTracks) {
      return <div><img className="justify-center" src="./spinner.svg" alt="Loading spinner" /></div>;
    }

    if (trackList.length > 0) {
      return (
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-2">Tracklist:</h4>
          <ul className="divide-y divide-gray-200">
            {trackList.map((track, index) => (
              <li key={track.id || index} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-4">{index + 1}</span>
                  <p className="font-medium">{track.name}</p>
                </div>
                <span className="text-gray-500">{formatDuration(track.duration_ms)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return <p className="text-lg">No tracks available for this album.</p>;
  };

  // Function to format track duration (milliseconds to MM:SS)
  const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Display nothing if the user hasn't searched yet
  if (!hasSearched()) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Artist section */}
      {artistImage ? (
        <div className="flex items-center mb-10 bg-cyan-500 rounded-xl p-6">
          <img
            src={artistImage}
            alt={`${artistName} Image`}
            className="w-44 h-44 rounded-full"
          />
          <h2 className="text-7xl font-bold ml-12">{artistName}</h2>
        </div>
      ) : (
        <div className="flex items-center mb-10 bg-cyan-500 rounded-xl p-6">
          <h2 className="text-7xl font-bold ml-12">{artistName}</h2>
        </div>
      )}

      {/* Selected album */}
      {selectedAlbum ? (
        <div>
          <button onClick={handleBack} className="text-blue-500 underline mb-4">
            Back to Albums
          </button>
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
            <div className="flex">
              <img
                src={selectedAlbum.images?.[0]?.url || '/placeholder-image.png'}
                alt={`${selectedAlbum.name} Cover`}
                className="w-64 h-64 object-cover rounded-md mr-6"
              />
              <div>
                <h3 className="text-3xl font-bold mb-4">{selectedAlbum.name}</h3>
                <p className="text-gray-600">
                  {selectedAlbum.artists.map((artist) => artist.name).join(', ')}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Release Date: {selectedAlbum.release_date}
                </p>
                <p className="text-sm text-gray-500">
                  Total Tracks: {selectedAlbum.total_tracks}
                </p>
              </div>
            </div>
            {renderTrackList()}
          </div>
        </div>
      ) : (
        // Albums grid
        results?.albums && results.albums.length > 0 ? (
          <div>
            <h2 className="text-3xl font-semibold mb-8">Albums:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.albums.map((album) => (
                <div
                  key={album.id}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-xl cursor-pointer"
                  onClick={() => handleAlbumClick(album)}
                >
                  <img
                    src={album.images?.[0]?.url || '/placeholder-image.png'}
                    alt={`${album.name} Cover`}
                    className="w-64 h-64 object-cover rounded-md mb-4"
                  />
                  <div className="text-center">
                    <strong className="text-2xl">{album.name}</strong>
                    <p className="text-gray-600 mt-2">
                      {album.artists.map((artist) => artist.name).join(', ')}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Release Date: {album.release_date}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Tracks: {album.total_tracks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No albums to display. Search for an artist!
          </p>
        )
      )}
    </div>
  );
}
