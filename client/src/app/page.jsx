'use client';

import { useState } from 'react';
import ShowAlbums from './searchAlbums';
import NavBar from './navbar';
import RenderNew from './newAlbums';
import MusicPlayer from './musicPlayer';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentAlbumImg, setCurrentAlbumimg] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackList, setTrackList] = useState([]);


  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(true);
    setSelectedAlbum(null);
  };

  const resetToPopular = () => {
    setShowSearchResults(false); // Switch back to popular albums
  };

  const handleTrackSelection = (track, tracks) => {
    setTrackList(tracks); // Store the full tracklist
    setCurrentTrack(track); // Set the currently playing track
    const index = tracks.findIndex((t) => t.id === track.id);
    setCurrentTrackIndex(index !== -1 ? index : 0);
  };

  const handleNextTrack = () => {
    if (trackList.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % trackList.length;
    setCurrentTrack(trackList[nextIndex]);
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevTrack = () => {
    if (trackList.length === 0) return;
    const prevIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    setCurrentTrack(trackList[prevIndex]);
    setCurrentTrackIndex(prevIndex);
  };

  const handleAlbumImg = (image) => {
    setCurrentAlbumimg(image); 
  };

  return (
    <main className="h-screen flex flex-col">
      <NavBar onSearch={handleSearchResults} resetToPopular={resetToPopular} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 overflow-y-auto bg-gradient-to-r from-gray-600 to-teal-500 p-4">
          {showSearchResults ? (
            <ShowAlbums 
            results={searchResults} 
            onTrackSelect={handleTrackSelection} 
            setAlbumImg={setCurrentAlbumimg} 
            selectedAlbum={selectedAlbum} 
            setSelectedAlbum={setSelectedAlbum}
            />
          ) : (
            <RenderNew onTrackSelect={handleTrackSelection} setAlbumImg={setCurrentAlbumimg} />
          )}
        </div>
        <div className="w-1/3 bg-teal-600 p-4">
          <MusicPlayer 
            currentTrack={currentTrack} 
            currentAlbumImg={currentAlbumImg} 
            onNextTrack={handleNextTrack} 
            onPrevTrack={handlePrevTrack} 
            trackList={trackList}
            currentTrackIndex={currentTrackIndex} 
          />
        </div>
      </div>
    </main>
  );

}
