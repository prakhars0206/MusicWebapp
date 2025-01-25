'use client';
import { useState, useEffect } from "react";
import ShowTracks from "./tracklist";

export default function RenderNew() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const fetchNew = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/new_releases`, { method: "GET" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch new releases");
      }

      
      setAlbums(data.newReleases);
    } catch (error) {
      console.error("Error fetching new releases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNew();
  }, []);

  return (
    <div className="p-6">
      <div className="rounded-xl p-10 bg-cyan-500">
        <h2 className="text-3xl font-bold mb-6">New Releases</h2>

        {loading ? (
          <div><img className="justify-center" src="./2ndspinner.svg" alt="Loading spinner" /></div>
        ) : selectedAlbum ? (
          <ShowTracks
            selectedAlbum={selectedAlbum}
            onBack={() => setSelectedAlbum(null)}
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="flex-shrink-0 flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl"
                  style={{ width: "250px" }}
                  onClick={() => setSelectedAlbum(album)}
                >
                  <img
                    src={album.images?.[0]?.url}
                    alt={`${album.name} Cover`}
                    className="w-60 h-60 object-cover rounded-md mb-4"
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
        )}
      </div>
    </div>
  );
}
