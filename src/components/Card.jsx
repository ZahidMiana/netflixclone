import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { RiThumbUpFill, RiThumbDownFill } from 'react-icons/ri';
import { BsCheck } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';



export default function Card({ movieData, isLiked = false, onRemove }) {
    const [isHovered, setIsHovered] = useState(false);
    const [inMyList, setInMyList] = useState(false);
    const navigate = useNavigate();

    const videoSrc = process.env.PUBLIC_URL + '/videos/video.mp4';

    // Check if movie is in user's list
    React.useEffect(() => {
        const savedList = localStorage.getItem('myNetflixList');
        if (savedList) {
            const myList = JSON.parse(savedList);
            setInMyList(myList.some(movie => movie.id === movieData.id));
        }
    }, [movieData.id]);

    const handleListToggle = () => {
        const savedList = localStorage.getItem('myNetflixList');
        let myList = savedList ? JSON.parse(savedList) : [];

        if (inMyList) {
            // Remove from list
            myList = myList.filter(movie => movie.id !== movieData.id);
            setInMyList(false);
            if (onRemove) onRemove();
        } else {
            // Add to list
            myList.push(movieData);
            setInMyList(true);
        }

        localStorage.setItem('myNetflixList', JSON.stringify(myList));
    };


    const handlePlay = () => {
        navigate("/player", { state: { movie: movieData } });
    };


    return (
        <Container
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
                alt={movieData.name}
            />
            {
                isHovered && (
                    <div className="hover">
                        <div className="image-video-container">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
                                alt={movieData.name}
                                onClick={() => navigate("/player")}
                            />

                            <video
                                src={videoSrc}
                                autoPlay
                                loop
                                muted
                                onClick={() => navigate("/player")}
                            />
                        </div>

                        <div className="info-container flex column">
                            <h3 className="name" onClick={() => navigate("/player")}>
                                {movieData.name}
                            </h3>
                            <div className="icons flex j-between">
                                <div className="controls flex">
                                    <IoPlayCircleSharp
                                        title="Play"
                                        onClick={handlePlay}
                                    />
                                    <RiThumbUpFill title="Like" />
                                    <RiThumbDownFill title="Dislike" />
                                    {
                                        inMyList ? (
                                            <BsCheck
                                                title="Remove from List"
                                                onClick={handleListToggle}
                                            />
                                        ) : (
                                            <AiOutlinePlus
                                                title="Add to my List"
                                                onClick={handleListToggle}
                                            />
                                        )
                                    }
                                </div>
                                <div className="info">
                                    <BiChevronDown title="More Info" />
                                </div>
                            </div>
                            <div className="genres flex">
                                <ul className="flex">
                                    {
                                        movieData.genres.map((genre) => {
                                            return <li key={genre}>{genre}</li>;
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }
        </Container>
    );
}

const Container = styled.div`
    max-width: 230px;
    width: 230px;
    height: 100%;
    cursor: pointer;
    position: relative;
    
    img {
        border-radius: 0.2rem;
        width: 100%;
        height: 100%;
        z-index: 10;
    }
    
    .hover {
        z-index: 99;
        height: max-content;
        width: 20rem;
        position: absolute;
        top: -18vh;
        left: 0;
        border-radius: 0.3rem;
        box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
        background-color: #181818;
        transition: 0.3s ease-in-out;
        
        .image-video-container {
            position: relative;
            height: 140px;
            
            img {
                width: 100%;
                height: 140px;
                object-fit: cover;
                border-radius: 0.3rem;
                top: 0;
                z-index: 4;
                position: absolute;
            }
            
            video {
                width: 100%;
                height: 140px;
                object-fit: cover;
                border-radius: 0.3rem;
                top: 0;
                z-index: 5;
                position: absolute;
            }
        }
        
        .info-container {
            padding: 1rem;
            gap: 0.5rem;
        }
        
        .icons {
            .controls {
                display: flex;
                gap: 1rem;
            }
            
            svg {
                font-size: 2rem;
                cursor: pointer;
                transition: 0.3s ease-in-out;
                
                &:hover {
                    color: #b3b3b3;
                }
            }
        }
        
        .genres {
            ul {
                gap: 1rem;
                
                li {
                    padding-right: 0.7rem;
                    color: white;
                    font-size: 1.2rem;
                    list-style-type: none;
                    white-space: nowrap;
                }
            }
        }
    }
    
    .name {
        margin-left: 1rem;
        font-size: 1.3rem;
        color: white;
        cursor: pointer;
        
        &:hover {
            color: #b3b3b3;
        }
    }
`;