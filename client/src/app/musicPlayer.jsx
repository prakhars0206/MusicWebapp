'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaRedo, FaStepBackward, FaStepForward } from 'react-icons/fa';

export default function MusicPlayer({ currentTrack, currentAlbumImg, onNextTrack, onPrevTrack, trackList, currentTrackIndex }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [audioCache, setAudioCache] = useState(new Map());
  const audioRef = useRef(null);

  const containerStyle = {
    backgroundImage: `url(${currentAlbumImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'darken',
    backgroundColor: 'rgba(0,0,0,0.7)',
  };

  //Fetch audio for current track using caching
  useEffect(() => {
    if (!currentTrack) return;

    const fetchAudio = async () => {
      //Check cache first
      if (audioCache.has(currentTrack.id)) {
        // Update cache order
        const url = audioCache.get(currentTrack.id);
        setAudioCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(currentTrack.id); // Remove from current position
          newCache.set(currentTrack.id, url); // Add to end (most recent)
          return newCache;
        });
        setAudioUrl(url);
        return;
      }

      try {
        const videoRes = await axios.get(`https://musicwebapp-bg57.onrender.com/api/youtube/search`, {
          params: { query: `${currentTrack.name} ${currentTrack.artists.map(a => a.name).join(' ')} ${currentTrack.explicit||false}` }
        });
        
        
        const audioRes = await axios.get(`https://musicwebapp-bg57.onrender.com/api/audio/audio`, { 
          params: { videoId: videoRes.data.songId } 
        });

        // Update cache with new entry
        setAudioCache(prev => {
          const newCache = new Map(prev);
          newCache.set(currentTrack.id, audioRes.data.audioUrl);
          
          // Remove oldest entry if cache exceeds 15
          if (newCache.size > 15) {
            const firstKey = newCache.keys().next().value;
            newCache.delete(firstKey);
          }
          return newCache;
        });
        setAudioUrl(audioRes.data.audioUrl);
        console.log(audioCache);
      } catch (err) {
        console.error('Error fetching audio:', err);
      }
    };

    fetchAudio();
  }, [currentTrack]);

  // preload the next track
  useEffect(() => {
    if (!trackList?.length || currentTrackIndex === null) return;

    const nextIndex = (currentTrackIndex + 1) % trackList.length;
    const nextTrack = trackList[nextIndex];
    if (!nextTrack || audioCache[nextTrack.id]) return;

    const preloadNext = async () => {
      try {
        const videoRes = await axios.get(`http://localhost:5001/api/youtube/search`, {
          params: { query: `${nextTrack.name} ${nextTrack.artists.map(a => a.name).join(' ')} ${nextTrack.explicit||false}` }
        });

        const audioRes = await axios.get(`http://localhost:5001/api/audio/audio`, { 
          params: { videoId: videoRes.data.songId } 
        });

        // Add to cache with LRU management
        setAudioCache(prev => {
          const newCache = new Map(prev);
          newCache.set(nextTrack.id, audioRes.data.audioUrl);
          
          if (newCache.size > 15) {
            const firstKey = newCache.keys().next().value;
            newCache.delete(firstKey);
          }
          return newCache;
        });
        console.log(audioCache);
      } catch (err) {
        console.error('Error preloading next track:', err);
      }
    };

    preloadNext();
  }, [currentTrackIndex, trackList]);

  //Handling audio playback
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioUrl) return;

    const updateProgress = () => {
      setProgress((audioElement.currentTime / audioElement.duration) * 100);
    };

    const handleEnd = () => {
      if (repeat) {
        audioElement.currentTime = 0;
        audioElement.play();
      } else {
        onNextTrack();
      }
    };

    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleEnd);

    // Auto-play when audio loads
    const playAudio = async () => {
      try {
        await audioElement.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback error:', err);
      }
    };

    console.log(audioCache);

    playAudio();

    return () => {
      audioElement.pause();
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('ended', handleEnd);
    };
  }, [audioUrl, repeat]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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
              <audio ref={audioRef} src={audioUrl} />
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