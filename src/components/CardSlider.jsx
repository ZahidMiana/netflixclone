import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

export default function CardSlider({ data, title }) {
    const listRef = useRef();
    const [sliderPosition, setSliderPosition] = useState(0);
    const [showControls, setShowControls] = useState(false);

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

    return (
        <Container 
            className="flex column"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
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
                    className={`slider-action right ${!showControls ? "none" : ""} ${sliderPosition === 4 && "none"}`}
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
    }
    
    .wrapper {
        position: relative;
        
        .slider {
            width: max-content;
            gap: 1rem;
            transform: translateX(0px);
            transition: 0.3s ease-in-out;
            margin-left: 50px;
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
    
    @media (max-width: 1200px) {
        h1 {
            margin-left: 20px;
        }
        
        .wrapper .slider {
            margin-left: 20px;
        }
    }
`;