'use client';
import { useState } from "react";
import ShowTracks from "./tracklist";

export default function ShowAlbums({ results }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const artistName = results?.artist || 'Unknown Artist';
  const artistImage = results?.artist_img?.[0]?.url || null;

  return (
    <div className="p-6">
      {artistImage ? (
        <div className="flex items-center mb-10 bg-cyan-500 rounded-xl p-10">
          <img src={artistImage} alt={`${artistName} Image`} className="w-48 h-48 rounded-full" />
          <h2 className="text-7xl font-bold ml-12">{artistName}</h2>
        </div>
      ) : (
        <div className="flex items-center mb-10 bg-cyan-500 rounded-xl p-6">
          <h2 className="text-7xl font-bold ml-12">{artistName}</h2>
        </div>
      )}

      {selectedAlbum ? (
        <ShowTracks
          selectedAlbum={selectedAlbum}
          onBack={() => setSelectedAlbum(null)}
        />
      ) : (
        results?.albums && results.albums.length > 0 ? (
          <div>
            <h2 className="text-3xl font-semibold mb-8">Albums:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.albums.map((album) => (
                <div
                  key={album.id}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <img
                    src={album.images?.[0]?.url }
                    alt={`${album.name} Cover`}
                    className="w-64 h-64 object-cover rounded-md mb-4"
                  />
                  <div className="text-center">
                    <strong className="text-2xl">{album.name}</strong>
                    <p className="text-gray-600 mt-2">{album.artists.map((artist) => artist.name).join(', ')}</p>
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
