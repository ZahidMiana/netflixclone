import React, { useState, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const controlsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [usingIframe, setUsingIframe] = useState(false);
  
  // Use useMemo to prevent recreation of movie object on each render
  const movie = useMemo(() => {
    return location.state?.movie || {
      id: "default",
      name: "Default Movie",
      image: "/netflix.png",
      trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    };
  }, [location.state]);
  
  // Convert YouTube URL to embed format and determine if we need iframe
  const getVideoSource = useMemo(() => {
    if (!movie.trailerUrl) return { src: "", useIframe: false };
    
    // If it's a YouTube URL
    if (movie.trailerUrl.includes("youtube.com/watch") || 
        movie.trailerUrl.includes("youtu.be")) {
      
      // Extract video ID
      let videoId = "";
      if (movie.trailerUrl.includes("v=")) {
        videoId = movie.trailerUrl.split("v=")[1]?.split("&")[0];
      } else if (movie.trailerUrl.includes("youtu.be")) {
        videoId = movie.trailerUrl.split("youtu.be/")[1]?.split("?")[0];
      }
      
      if (videoId) {
        return {
          src: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
          useIframe: true
        };
      }
    }
    
    // Default to standard video (for direct MP4 urls)
    return { 
      src: movie.trailerUrl,
      useIframe: false
    };
  }, [movie.trailerUrl]);

  useEffect(() => {
    // Set if we're using iframe based on the video source
    setUsingIframe(getVideoSource.useIframe);
    
    // For standard video element
    if (!getVideoSource.useIframe && videoRef.current) {
      videoRef.current.load();
    }
    
    // Initialize YouTube API for iframe control if needed
    if (getVideoSource.useIframe) {
      // Load YouTube iframe API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  }, [getVideoSource]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);
  
  useEffect(() => {
    // Save to watch history
    const saveToHistory = () => {
      const watchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]");
      
      // Make sure we have a valid movie with ID
      if (!movie.id) return;
      
      const existingIndex = watchHistory.findIndex(item => item.id === movie.id);
      
      if (existingIndex !== -1) {
        watchHistory[existingIndex].progress = progress;
        watchHistory[existingIndex].duration = duration;
        watchHistory[existingIndex].timestamp = Date.now();
      } else {
        watchHistory.push({
          id: movie.id,
          name: movie.name,
          image: movie.image,
          trailerUrl: movie.trailerUrl,
          progress: progress,
          duration: duration,
          timestamp: Date.now()
        });
      }
      
      // Keep only last 20 items
      if (watchHistory.length > 20) {
        watchHistory.sort((a, b) => b.timestamp - a.timestamp);
        watchHistory.length = 20;
      }
      
      localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
    };
    
    // Save progress every 5 seconds if we have some duration
    if (duration > 0) {
      const interval = setInterval(saveToHistory, 5000);
      return () => clearInterval(interval);
    }
  }, [movie, progress, duration]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };
  
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setProgress(newTime);
    if (videoRef.current && !usingIframe) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const togglePlay = () => {
    if (usingIframe) {
      // For YouTube iframes, we need to use the YouTube API
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    setShowControls(true);
  };
  
  const toggleMute = () => {
    if (usingIframe) {
      // For YouTube iframes, just track state
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle click on the back button
  const handleBack = (e) => {
    e.stopPropagation();
    navigate(-1);
  };

  return (
    <Container 
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlay}
    >
      <div className="player">
        <div className="back" onClick={handleBack}>
          <BsArrowLeft />
        </div>
        
        {usingIframe ? (
          <div className="iframe-container">
            <iframe
              ref={iframeRef}
              src={getVideoSource.src}
              title={movie.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <source src={getVideoSource.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {showControls && (
          <div className="controls-overlay" ref={controlsRef} onClick={(e) => e.stopPropagation()}>
            <div className="movie-info">
              <h1>{movie.name}</h1>
              {movie.genres && (
                <div className="genres">
                  {movie.genres.join(" • ")}
                </div>
              )}
            </div>
            
            <div className="controls">
              <button onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              {!usingIframe && (
                <div className="progress-container">
                  <span className="time">{formatTime(progress)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={progress}
                    onChange={handleProgressChange}
                    className="progress"
                  />
                  <span className="time">{formatTime(duration)}</span>
                </div>
              )}
              
              <button onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          </div>
        )}
        
        {!isPlaying && !showControls && (
          <div className="play-overlay">
            <FaPlay className="big-play-button" onClick={togglePlay} />
          </div>
        )}
        
        <div className="trailer-badge">
          TRAILER
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: black;
  
  .player {
    height: 100%;
    width: 100%;
    position: relative;
    
    .back {
      position: absolute;
      top: 2rem;
      left: 2rem;
      z-index: 3;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.1);
        background: rgba(229, 9, 20, 0.8);
      }
    }
    
    video, .iframe-container {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    
    .iframe-container {
      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
    
    .controls-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 2rem;
      z-index: 2;
      
      .movie-info {
        margin-bottom: 2rem;
        
        h1 {
          color: white;
          font-size: 2rem;
          margin: 0;
          margin-bottom: 0.5rem;
        }
        
        .genres {
          color: #ccc;
          font-size: 1rem;
        }
      }
      
      .controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        button {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            background: rgba(255,255,255,0.2);
          }
        }
        
        .progress-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          
          .time {
            color: white;
            font-size: 0.8rem;
          }
          
          .progress {
            flex: 1;
            height: 5px;
            -webkit-appearance: none;
            appearance: none;
            background: rgba(255,255,255,0.3);
            border-radius: 5px;
            outline: none;
            
            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 15px;
              height: 15px;
              background: #E50914;
              border-radius: 50%;
              cursor: pointer;
            }
            
            &::-moz-range-thumb {&::-moz-range-thumb {
              width: 15px;
              height: 15px;;
              background: #E50914;E50914;
              border-radius: 50%;
              border: none;
              cursor: pointer;er;
            }
          }
        }
      }
    }
    
    .play-overlay {.play-overlay {
      position: absolute;olute;
      top: 0;
      left: 0;;
      right: 0;;
      bottom: 0;;
      display: flex;lex;
      align-items: center;enter;
      justify-content: center;ter;
      background: rgba(0,0,0,0.3);.3);
      z-index: 2;
      
      .big-play-button {.big-play-button {
        font-size: 5rem;
        color: white;
        cursor: pointer;er;
        background: rgba(229, 9, 20, 0.8);(229, 9, 20, 0.8);
        padding: 1rem;
        border-radius: 50%;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.1);
          background: rgba(229, 9, 20, 1);
        }
      }
    }
    
    .trailer-badge {
      position: absolute;
      top: 2rem;
      right: 2rem;
      background: rgba(229, 9, 20, 0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.8rem;
      letter-spacing: 1px;
      z-index: 3;
    }
  }
`;      
        
       