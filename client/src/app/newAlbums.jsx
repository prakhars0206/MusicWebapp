'use client';
import { useState, useEffect } from "react";
import ShowTracks from "./tracklist";

export default function RenderNew({ onTrackSelect, setAlbumImg }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  
  useEffect(() => {
    const fetchNew = async () => {
      try {
        const response = await fetch(`https://musicwebapp-bg57.onrender.com/api/new_releases`, { method: 'GET' });
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch new releases');
        }
        setAlbums(data.newReleases);
      } catch (error) {
        console.error('Error fetching new releases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNew();
  }, []);

  useEffect(() => {
    if (albums.length === 0 || isManual) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % albums.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [albums, currentIndex, isManual]);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const album = albums[currentIndex];

  return (
    <div>
      <h2 className = "mb-4 text-cyan-100">New Releases</h2>
      <div className="relative w-full h-96 flex items-center justify-center bg-black text-white rounded-xl overflow-hidden"
        onMouseOver={() => {

          setIsManual(true);

        }}
        onMouseOut={() =>{
          setIsManual(false);
        }}
      >
        <img src={album.images[0].url} alt={album.name} className="absolute w-1/2  object-cover opacity-35" />
        <div className="relative z-10 text-center p-6">
          <h2 className="text-4xl font-bold">{album.name}</h2>
          <p className="text-lg mt-2">{album.artists.map(a => a.name).join(", ")}</p>
          <button
            className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-full"
            onClick={() => {
              setSelectedAlbum(album);
              
            }}
          >
            Listen Now
          </button>
        </div>
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-full"
          onClick={() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + albums.length) % albums.length);
            
          }}
        >
          ←
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-full"
          onClick={() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % albums.length);

          }}
        >
          →
        </button>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-700">
          <div className="h-2 bg-white transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      {selectedAlbum && (
        <div className="mt-6">
          <ShowTracks
            selectedAlbum={selectedAlbum}
            onBack={() => setSelectedAlbum(null)}
            onTrackSelect={onTrackSelect}
            setAlbumImg={setAlbumImg}
            albumImg={selectedAlbum.images?.[0]?.url}
          />
        </div>
      )}
    </div>
  );
}
