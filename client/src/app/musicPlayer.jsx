'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function MusicPlayer({ currentTrack, currentAlbumImg }) {
  const [videoId, setVideoId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const containerStyle = {
    backgroundImage: `url(${currentAlbumImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'darken',
    backgroundColor: 'rgba(0,0,0,0.7)', // Dark overlay
  };

  // Fetch YouTube video ID when track changes
  useEffect(() => {
    if (currentTrack) {
      axios
        .get(`http://localhost:5001/api/youtube/search`, {
          params: { query: `${currentTrack.name} ${currentTrack.artists.map(a => a.name).join(' ')}` }
        })
        .then((res) => setVideoId(res.data.videoId))
        .catch((err) => console.error('Error fetching YouTube video ID:', err.response || err));
    }
  }, [currentTrack]);

  // Fetch the direct audio URL when video ID changes
  useEffect(() => {
    if (videoId) {
      axios
        .get(`http://localhost:5001/api/audio/audio`, { params: { videoId } })
        .then((res) => setAudioUrl(res.data.audioUrl))
        .catch((err) => console.error('Error fetching YouTube audio:', err.response || err));
    }
  }, [videoId]);

  // Handle play/pause functionality
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress bar as audio plays
  useEffect(() => {
    if (audioRef.current) {
      const updateProgress = () => {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      return () => {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [audioUrl]);

  // Seek audio
  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full w-full p-6 rounded-xl shadow-lg transition-all"
      style={containerStyle}
    >
      {currentTrack ? (
        <>
          {/* Album Cover */}
          <img
            src={currentAlbumImg}
            alt="Album Cover"
            className="w-48 h-48 object-cover rounded-md mb-4 shadow-lg"
          />

          {/* Song Details */}
          <h2 className="text-xl font-semibold text-white">{currentTrack.name}</h2>
          <p className="text-gray-300">{currentTrack.artists?.map((artist) => artist.name).join(', ')}</p>

          {/* Audio Player */}
          {audioUrl ? (
            <>
              <audio ref={audioRef} src={audioUrl} preload="auto" />

              {/* Playback Controls */}
              <div className="flex items-center gap-6 mt-4">
                <button onClick={togglePlayPause} className="bg-white text-black p-3 rounded-full shadow-md">
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>
                <input
                  type="range"
                  className="w-48"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-400">Loading audio...</p>
          )}
        </>
      ) : (
        <p className="text-gray-400">No track playing</p>
      )}
    </div>
  );
}
