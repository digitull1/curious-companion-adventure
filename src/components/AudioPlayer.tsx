
import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  audioContent: string;
  contentType: string;
  messageId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioContent, contentType, messageId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = `data:${contentType};base64,${audioContent}`;

  useEffect(() => {
    if (audioRef.current) {
      // Set up event listeners
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      // Add event listeners
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
      
      // Remove event listeners on cleanup
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Pause all other audio elements before playing this one
        document.querySelectorAll('audio').forEach(audio => {
          if (audio !== audioRef.current) {
            audio.pause();
          }
        });
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center p-2 bg-wonder-purple/10 rounded-lg mt-2" aria-label="Audio player">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <button 
        onClick={togglePlay}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-wonder-purple text-white flex items-center justify-center hover:bg-wonder-purple-dark transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      
      <div className="flex-grow mx-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full h-2 bg-wonder-purple/20 rounded-full accent-wonder-purple cursor-pointer"
          aria-label="Audio progress"
        />
        <div className="flex justify-between text-xs text-wonder-purple/70 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <button
        onClick={toggleMute}
        className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-wonder-purple/20 flex items-center justify-center transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="h-4 w-4 text-wonder-purple" /> : <Volume2 className="h-4 w-4 text-wonder-purple" />}
      </button>
    </div>
  );
};

export default AudioPlayer;
