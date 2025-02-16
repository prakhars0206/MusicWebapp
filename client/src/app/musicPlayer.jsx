'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaRedo, FaStepBackward, FaStepForward } from 'react-icons/fa';

export default function MusicPlayer({ currentTrack, currentAlbumImg, onNextTrack, onPrevTrack }) {
  const [videoId, setVideoId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(null);


  const containerStyle = {
    backgroundImage: `url(${currentAlbumImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'darken',
    backgroundColor: 'rgba(0,0,0,0.7)',
  };

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

  useEffect(() => {
    if (videoId) {
      axios
        .get(`http://localhost:5001/api/audio/audio`, { params: { videoId } })
        .then((res) => setAudioUrl(res.data.audioUrl))
        .catch((err) => console.error('Error fetching YouTube audio:', err.response || err));
    }
  }, [videoId]);

  const togglePlayPause = () => {
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {

      const updateProgress = () => {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      };

      const handleEnd = () => {
        if (repeat) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else {
            onNextTrack();
        }
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnd);
      
      audioRef.current.play();
      setIsPlaying(true);
      return () => {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleEnd);
      };
    }
  }, [audioUrl, repeat]);

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  const handleRepeat = () => {
    setRepeat(!repeat);
  };


  return (
    <div 
      className="flex flex-col items-center justify-center h-full w-full p-6 rounded-xl shadow-lg transition-all"
      style={containerStyle}
    >
      {currentTrack ? (
        <>
          <img
            src={currentAlbumImg}
            alt="Album Cover"
            className="w-64 h-64 object-cover rounded-md mb-4 shadow-lg"
          />

          <h2 className="text-xl font-semibold text-white">{currentTrack.name}</h2>
          <p className="text-gray-300">{currentTrack.artists?.map((artist) => artist.name).join(', ')}</p>

          {audioUrl ? (
            <>
              <audio ref={audioRef} src={audioUrl} preload="auto" />
              <input
                type="range"
                className="w-80 mt-16"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
              />
              <div className="flex items-center gap-6 mt-4">
                <button onClick={onPrevTrack} className="bg-white text-black p-3 rounded-full shadow-md">
                  <FaStepBackward size={20} />
                </button>
                <button onClick={togglePlayPause} className="bg-white text-black p-3 rounded-full shadow-md">
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>
                <button onClick={onNextTrack} className="bg-white text-black p-3 rounded-full shadow-md">
                  <FaStepForward size={20} />
                </button>
                <button onClick={handleRepeat} className={`p-3 rounded-full shadow-md ${repeat ? 'bg-green-500' : 'bg-white text-black'}`}>
                  <FaRedo size={20} />
                </button>
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
