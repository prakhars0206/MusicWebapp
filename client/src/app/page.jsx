'use client';

import { useState } from 'react';
import ShowAlbums from './searchAlbums';
import NavBar from './navbar';
import RenderNew from './newAlbums';
import MusicPlayer from './musicPlayer';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentAlbumImg, setCurrentAlbumimg] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const resetToPopular = () => {
    setShowSearchResults(false); // Switch back to popular albums
  };

  const handleTrackSelection = (track) => {
    setCurrentTrack(track); // Update the currently playing track
  };
  
  const handleAlbumImg = (image) => {
    setCurrentAlbumimg(image); 
  };

  return (
    <main className="h-screen flex flex-col">
      {/* Navbar */}
      <NavBar onSearch={handleSearchResults} resetToPopular={resetToPopular} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Section: Search Results or New Releases */}
        <div className="w-2/3 overflow-y-auto bg-sky-200 p-4">
          {showSearchResults ? (
            <ShowAlbums results={searchResults} onTrackSelect={handleTrackSelection} setAlbumImg={setCurrentAlbumimg}/>
          ) : (
            <RenderNew onTrackSelect={handleTrackSelection} setAlbumImg={setCurrentAlbumimg}/>
          )}
        </div>

        {/* Right Section: Music Player */}
        <div className="w-1/3 bg-white border-l border-gray-300 p-4">
          <MusicPlayer currentTrack={currentTrack} currentAlbumImg={currentAlbumImg} />
        </div>
      </div>
    </main>
  );
}
