'use client';
import { useState } from "react";
import ShowTracks from "./tracklist";

export default function ShowAlbums({ results, onTrackSelect }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const artistName = results?.artist || 'Unknown Artist';
  const artistImage = results?.artist_img?.[0]?.url || null;

  return (
    <div className="p-6">
      {/* Artist Header */}
      {artistImage ? (
        <div className="flex items-center mb-10 bg-cyan-500 rounded-xl p-8">
          <img
            src={artistImage}
            alt={`${artistName} Image`}
            className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover"
          />
          <h2 className="text-5xl sm:text-7xl font-bold ml-8">{artistName}</h2>
        </div>
      ) : (
        <div className="flex items-center mb-10 bg-cyan-500 rounded-xl p-6">
          <h2 className="text-5xl sm:text-7xl font-bold">{artistName}</h2>
        </div>
      )}

      {/* Albums Section */}
      {selectedAlbum ? (
        <ShowTracks
          selectedAlbum={selectedAlbum}
          onBack={() => setSelectedAlbum(null)}
          onTrackSelect={onTrackSelect}
        />
      ) : results?.albums && results.albums.length > 0 ? (
        <div>
          <h2 className="text-3xl font-semibold mb-6">Albums:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.albums.map((album) => (
              <div
                key={album.id}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer"
                onClick={() => setSelectedAlbum(album)}
              >
                {/* Square Album Image */}
                <div className="w-full aspect-square overflow-hidden rounded-md mb-4">
                  <img
                    src={album.images?.[0]?.url}
                    alt={`${album.name} Cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Album Info */}
                <div className="text-center">
                  <strong className="text-lg sm:text-lg block w-full">
                    {album.name}
                  </strong>
                  <p className="text-sm text-gray-600 mt-1 block w-full">
                    {album.artists.map((artist) => artist.name).join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Release Date: {album.release_date}
                  </p>
                  <p className="text-xs text-gray-500">
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
      )}
    </div>
  );
}
