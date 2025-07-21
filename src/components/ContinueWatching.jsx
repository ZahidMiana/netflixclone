import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function ContinueWatching() {
    const [watchHistory, setWatchHistory] = useState([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const listRef = useRef();
    const navigate = useNavigate();

    // Load watch history from localStorage
    const loadWatchHistory = () => {
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        // Filter out entries without proper data
        const validHistory = history.filter(item => 
            item && item.id && item.name && item.image && item.trailerUrl
        );
        setWatchHistory(validHistory);
    };

    useEffect(() => {
        loadWatchHistory();
        
        // Add event listener for storage changes
        window.addEventListener('storage', loadWatchHistory);
        return () => window.removeEventListener('storage', loadWatchHistory);
    }, []);

    const handleDirection = (direction) => {
        let distance = listRef.current.getBoundingClientRect().x - 70;
        if (direction === "left" && sliderPosition > 0) {
            listRef.current.style.transform = `translateX(${230 + distance}px)`;
            setSliderPosition(sliderPosition - 1);
        }
        if (direction === "right" && sliderPosition < 4) {
            listRef.current.style.transform = `translateX(${-230 + distance}px)`;
            setSliderPosition(sliderPosition + 1);
        }
    };
    
    const handlePlay = (movie, e) => {
        e.stopPropagation();
        navigate("/player", { state: { movie } });
    };
    
    const handleRemove = (id, e) => {
        e.stopPropagation();
        const updatedHistory = watchHistory.filter(item => item.id !== id);
        setWatchHistory(updatedHistory);
        localStorage.setItem("watchHistory", JSON.stringify(updatedHistory));
    };

    const getProgressPercent = (movie) => {
        if (!movie.progress || !movie.duration || movie.duration === 0) return 0;
        const percent = (movie.progress / movie.duration) * 100;
        return Math.min(percent, 100); // Cap at 100%
    };

    if (watchHistory.length === 0) {
        return null;
    }

    return (
        <Container
            className="flex column"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <h1>Continue Watching</h1>
            
            <div className="wrapper">
                <div 
                    className={`slider-action left ${!showControls ? "none" : ""} ${sliderPosition === 0 && "none"}`}
                    onClick={() => handleDirection("left")}
                >
                    <AiOutlineLeft />
                </div>
                <div className="slider flex" ref={listRef}>
                    {
                        watchHistory.map((movie, index) => {
                            const imageUrl = movie.image.startsWith('http') 
                                ? movie.image
                                : `https://image.tmdb.org/t/p/w500${movie.image}`;
                                
                            return (
                                <div 
                                    className="movie-card" 
                                    key={`${movie.id}-${index}`} 
                                    onClick={() => navigate("/player", { state: { movie } })}
                                >
                                    <img src={imageUrl} alt={movie.name} />
                                    <div className="progress-bar">
                                        <div 
                                            className="progress" 
                                            style={{width: `${getProgressPercent(movie)}%`}}
                                        ></div>
                                    </div>
                                    <div className="hover-overlay">
                                        <div className="buttons">
                                            <button className="play" onClick={(e) => handlePlay(movie, e)}>
                                                <FaPlay />
                                            </button>
                                            <button className="remove" onClick={(e) => handleRemove(movie.id, e)}>
                                                <IoMdClose />
                                            </button>
                                        </div>
                                        <div className="info">
                                            <h3>{movie.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div 
                    className={`slider-action right ${!showControls ? "none" : ""} ${
                        (sliderPosition === 4 || watchHistory.length <= 5) && "none"
                    }`}
                    onClick={() => handleDirection("right")}
                >
                    <AiOutlineRight />
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    gap: 1rem;
    position: relative;
    padding: 2rem 0;
    
    h1 {
        margin-left: 50px;
        color: white;
        font-size: 1.8rem;
        font-weight: 600;
    }
    
    .wrapper {
        position: relative;
        
        .slider {
            width: max-content;
            gap: 1rem;
            transform: translateX(0px);
            transition: 0.3s ease-in-out;
            margin-left: 50px;
            
            .movie-card {
                width: 230px;
                height: 130px;
                position: relative;
                cursor: pointer;
                overflow: hidden;
                border-radius: 4px;
                transition: transform 0.3s ease;
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background-color: rgba(255, 255, 255, 0.3);
                    z-index: 2;
                    
                    .progress {
                        height: 100%;
                        background-color: #E50914;
                    }
                }
                
                .hover-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 10px;
                    z-index: 1;
                    
                    .buttons {
                        display: flex;
                        justify-content: space-between;
                        
                        button {
                            background-color: rgba(0, 0, 0, 0.5);
                            border: 1px solid white;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            color: white;
                            
                            &:hover {
                                background-color: #E50914;
                                border-color: #E50914;
                                transform: scale(1.1);
                            }
                            
                            &.remove {
                                background-color: rgba(0, 0, 0, 0.7);
                                
                                &:hover {
                                    background-color: rgba(255, 255, 255, 0.7);
                                    color: black;
                                }
                            }
                        }
                    }
                    
                    .info {
                        h3 {
                            color: white;
                            margin: 0;
                            font-size: 1rem;
                            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
                        }
                    }
                }
                
                &:hover {
                    transform: scale(1.05);
                    z-index: 10;
                    
                    .hover-overlay {
                        opacity: 1;
                    }
                }
            }
        }
        
        .slider-action {
            position: absolute;
            z-index: 99;
            height: 100%;
            top: 0;
            bottom: 0;
            width: 50px;
            transition: 0.3s ease-in-out;
            cursor: pointer;
            
            svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                color: white;
            }
            
            &.left {
                left: 0;
                background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, transparent 100%);
            }
            
            &.right {
                right: 0;
                background: linear-gradient(270deg, rgba(0,0,0,0.8) 0%, transparent 100%);
            }
            
            &:hover {
                background-color: rgba(20, 20, 20, 0.5);
                
                svg {
                    font-size: 2.5rem;
                }
            }
            
            &.none {
                display: none;
            }
        }
    }
    
    @media (max-width: 768px) {
        h1 {
            margin-left: 20px;
            font-size: 1.5rem;
        }
        
        .wrapper .slider {
            margin-left: 20px;
            
            .movie-card {
                width: 200px;
                height: 113px;
            }
        }
    }
`;