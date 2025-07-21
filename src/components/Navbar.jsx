import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import { FaBell } from 'react-icons/fa';
import Search from './Search';
import UserProfile from './UserProfile';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config'; 
import { useAuthState } from 'react-firebase-hooks/auth';


export default function Navbar({ isScrolled }) {
    const [isToggled, setIsToggled] = useState(false);
    const [user] = useAuthState(firebaseAuth);
    const navigate = useNavigate();

    const links = [
        { name: "Home", link: "/" },
        { name: "TV Shows", link: "/tv" },
        { name: "Movies", link: "/movies" },
        { name: "My List", link: "/mylist" },
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
        
        return () => unsubscribe();
    }, [navigate]);

    const handleSearch = (query) => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <Container>
            <nav className={`${isScrolled ? "scrolled" : ""} flex`}>
                <div className="left flex a-center">
                    <div className="brand flex a-center j-center">
                        <img src={logo} alt="logo" />
                    </div>
                    <ul className={`links flex ${isToggled ? "show" : ""}`}>
                        {links.map(({ name, link }) => {
                            return (
                                <li key={name}>
                                    <Link to={link}>{name}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="right flex a-center">
                    <Search onSearch={handleSearch} />
                    <FaBell className="notification-icon" />
                    <UserProfile user={user} />
                    <div className="toggle" onClick={() => setIsToggled(!isToggled)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </Container>
    );
}

const Container = styled.div`
    .scrolled {
        background-color: black !important;
    }
    nav {
        position: sticky;
        top: 0;
        height: 6.5rem;
        width: 100%;
        justify-content: space-between;
        position: fixed;
        z-index: 2;
        padding: 0 4rem;
        align-items: center;
        transition: 0.3s ease-in-out;
        .left {
            gap: 2rem;
            .brand {
                img {
                    height: 4rem;
                }
            }
            .links {
                list-style-type: none;
                gap: 2rem;
                li {
                    a {
                        color: white;
                        text-decoration: none;
                        &:hover {
                            color: #b3b3b3;
                        }
                    }
                }
            }
        }
        .right {
            gap: 1rem;
            align-items: center;
            
            .notification-icon {
                color: white;
                font-size: 18px;
                cursor: pointer;
                
                &:hover {
                    color: #b3b3b3;
                }
            }
            
            .toggle {
                display: none;
                flex-direction: column;
                cursor: pointer;
                span {
                    width: 25px;
                    height: 3px;
                    background-color: white;
                    margin: 3px 0;
                    transition: 0.3s;
                }
            }
        }
    }
    @media screen and (max-width: 1024px) {
        .toggle {
            display: flex !important;
        }
    }
`;