import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import Search from './Search';
import UserProfile from './UserProfile';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config'; 
import { useAuthState } from 'react-firebase-hooks/auth';


export default function Navbar({ isScrolled }) {
    const [isToggled, setIsToggled] = useState(false);
    const [user] = useAuthState(firebaseAuth);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    
    // Close mobile menu when clicking a link
    const handleMobileMenuClick = () => {
        setShowMobileMenu(false);
    };

    return (
        <Container>
            <nav className={`${isScrolled ? "scrolled" : ""} flex`}>
                <div className="left flex a-center">
                    <div className="brand flex a-center j-center">
                        <img src={logo} alt="logo" />
                    </div>
                    
                    {/* Desktop menu */}
                    <ul className="links desktop-links flex">
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
                    <div className="desktop-search">
                        <Search onSearch={handleSearch} />
                    </div>
                    <FaBell className="notification-icon" />
                    <UserProfile user={user} />
                    <div className="mobile-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                        {showMobileMenu ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </nav>
            
            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="mobile-menu">
                    <div className="mobile-search">
                        <Search onSearch={(query) => {
                            handleSearch(query);
                            handleMobileMenuClick();
                        }} />
                    </div>
                    <ul className="mobile-links">
                        {links.map(({ name, link }) => {
                            return (
                                <li key={name}>
                                    <Link to={link} onClick={handleMobileMenuClick}>
                                        {name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
    position: relative;
    z-index: 10;
    
    .scrolled {
        background-color: black !important;
    }
    
    nav {
        position: fixed;
        top: 0;
        left: 0;
        height: 6.5rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 2;
        padding: 0 4rem;
        transition: 0.3s ease-in-out;
        background-color: transparent;
        
        @media screen and (max-width: 768px) {
            padding: 0 2rem;
            height: 5rem;
        }
        
        @media screen and (max-width: 480px) {
            padding: 0 1rem;
        }
    }
    
    .left {
        display: flex;
        align-items: center;
        gap: 2rem;
        
        .brand {
            img {
                height: 4rem;
                
                @media screen and (max-width: 768px) {
                    height: 2.5rem;
                }
            }
        }
        
        .desktop-links {
            list-style-type: none;
            display: flex;
            gap: 2rem;
            
            @media screen and (max-width: 768px) {
                display: none;
            }
            
            li {
                a {
                    color: white;
                    text-decoration: none;
                    font-size: 1rem;
                    
                    &:hover {
                        color: #b3b3b3;
                    }
                }
            }
        }
    }
    
    .right {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        @media screen and (max-width: 768px) {
            gap: 0.7rem;
        }
        
        .desktop-search {
            @media screen and (max-width: 768px) {
                display: none;
            }
        }
        
        .notification-icon {
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            
            &:hover {
                color: #b3b3b3;
            }
            
            @media screen and (max-width: 480px) {
                font-size: 1rem;
            }
        }
        
        .mobile-toggle {
            display: none;
            cursor: pointer;
            font-size: 1.5rem;
            color: white;
            
            @media screen and (max-width: 768px) {
                display: block;
            }
            
            @media screen and (max-width: 480px) {
                font-size: 1.2rem;
            }
        }
    }
    
    .mobile-menu {
        position: fixed;
        top: 6.5rem;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 5;
        padding: 1rem;
        
        @media screen and (max-width: 768px) {
            top: 5rem;
        }
        
        .mobile-search {
            margin-bottom: 1rem;
        }
        
        .mobile-links {
            list-style-type: none;
            
            li {
                margin: 1rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 1rem;
                
                &:last-child {
                    border-bottom: none;
                }
                
                a {
                    color: white;
                    text-decoration: none;
                    font-size: 1.2rem;
                    display: block;
                    
                    @media screen and (max-width: 480px) {
                        font-size: 1rem;
                    }
                    
                    &:hover {
                        color: #b3b3b3;
                    }
                }
            }
        }
    }
`;