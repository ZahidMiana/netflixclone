import React from 'react';
import background from '../assets/login.jpg';
import styled from "styled-components";


export default function BackgroundImage(){
    return(
        <Container>
             <img src={background} alt="background"/>
        </Container>
    ); 
}


const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.4) 0%,
      rgba(0,0,0,0.6) 100%
    );
    z-index: 2;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;