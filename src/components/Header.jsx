import { useNavigate } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';


export default function Header(props){
    const navigate = useNavigate(); 

    return <Container>
        <div className="logo">
            <img src={logo}  alt="logo"/>
        </div>

        <button onClick={() => navigate (props.login ? "/login" : "/signup")}>{props.login ? "Log In" : "Sign In"}</button>
    </Container>
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  z-index: 100;
  
  .logo img {
    height: 40px;
    width: auto;
  }
  
  button {
    background-color: #e50914;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #f40612;
  }`;