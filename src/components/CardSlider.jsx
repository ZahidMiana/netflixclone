import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

export default function CardSlider({ data, title }) {
    const listRef = useRef();
    const [sliderPosition, setSliderPosition] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [maxSlides, setMaxSlides] = useState(4);
    const [cardWidth, setCardWidth] = useState(230);

    // Responsive settings based on screen width
    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                setCardWidth(160);
                setMaxSlides(data.length - 1);
            } else if (width <= 768) {
                setCardWidth(190);
                setMaxSlides(data.length - 2);
            } else {
                setCardWidth(230);
                setMaxSlides(data.length - 5);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [data.length]);

    const handleDirection = (direction) => {
        let distance = listRef.current.getBoundingClientRect().x - 70;
        if (direction === "left" && sliderPosition > 0) {
            listRef.current.style.transform = `translateX(${cardWidth + distance}px)`;
            setSliderPosition(sliderPosition - 1);
        }
        if (direction === "right" && sliderPosition < maxSlides) {
            listRef.current.style.transform = `translateX(${-cardWidth + distance}px)`;
            setSliderPosition(sliderPosition + 1);
        }
    };

    // Always show controls on touch devices
    useEffect(() => {
        if ('ontouchstart' in window) {
            setShowControls(true);
        }
    }, []);

    return (
        <Container 
            className="card-slider flex column"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => !('ontouchstart' in window) && setShowControls(false)}
        >
            <h1>{title}</h1>
            
            <div className="wrapper">
                <div 
                    className={`slider-action left ${!showControls ? "none" : ""} ${sliderPosition === 0 && "none"}`}
                    onClick={() => handleDirection("left")}
                >
                    <AiOutlineLeft />
                </div>
                <div className="slider flex" ref={listRef}>
                    {
                        data.map((movie, index) => {
                            return <Card movieData={movie} index={index} key={movie.id}/>
                        })
                    }
                </div>
                <div 
                    className={`slider-action right ${!showControls ? "none" : ""} ${sliderPosition >= maxSlides && "none"}`}
                    onClick={() => handleDirection("right")}
                >
                    <AiOutlineRight />
                </div>
            </div>
        </Container>
    )
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
        
        @media screen and (max-width: 768px) {
            margin-left: 30px;
            font-size: 1.5rem;
        }
        
        @media screen and (max-width: 480px) {
            margin-left: 20px;
            font-size: 1.2rem;
        }
    }
    
    .wrapper {
        position: relative;
        overflow: hidden;
        
        .slider {
            width: max-content;
            gap: 1rem;
            transform: translateX(0px);
            transition: 0.3s ease-in-out;
            margin-left: 50px;
            
            @media screen and (max-width: 768px) {
                margin-left: 30px;
                gap: 0.7rem;
            }
            
            @media screen and (max-width: 480px) {
                margin-left: 20px;
                gap: 0.5rem;
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
            
            @media screen and (max-width: 480px) {
                width: 40px;
            }
            
            svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                color: white;
                
                @media screen and (max-width: 768px) {
                    font-size: 1.5rem;
                }
                
                @media screen and (max-width: 480px) {
                    font-size: 1.2rem;
                }
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
    
    @media (max-width: 1200px) {
        h1 {
            margin-left: 20px;
        }
        
        .wrapper .slider {
            margin-left: 20px;
        }
    }
`;