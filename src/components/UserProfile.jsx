import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';
import { useNavigate } from 'react-router-dom';

export default function UserProfile({ user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [profiles] = useState([
        { id: 1, name: 'User', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, name: 'Kids', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 3, name: 'Guest', avatar: 'https://i.pravatar.cc/150?img=3' }
    ]);
    const [currentProfile, setCurrentProfile] = useState(profiles[0]);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(firebaseAuth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const switchProfile = (profile) => {
        setCurrentProfile(profile);
        setShowDropdown(false);
        localStorage.setItem('currentProfile', JSON.stringify(profile));
    };

    useEffect(() => {
        const savedProfile = localStorage.getItem('currentProfile');
        if (savedProfile) {
            setCurrentProfile(JSON.parse(savedProfile));
        }
    }, []);

    return (
        <Container>
            <div 
                className="profile-icon"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <img src={currentProfile.avatar} alt="Profile" />
                <span className="profile-name">{currentProfile.name}</span>
                <svg className="dropdown-arrow" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                </svg>
            </div>

            {showDropdown && (
                <div className="dropdown-menu">
                    <div className="profile-section">
                        <h4>Switch Profiles</h4>
                        {profiles.map(profile => (
                            <div 
                                key={profile.id}
                                className={`profile-item ${currentProfile.id === profile.id ? 'active' : ''}`}
                                onClick={() => switchProfile(profile)}
                            >
                                <img src={profile.avatar} alt={profile.name} />
                                <span>{profile.name}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="menu-section">
                        <div className="menu-item">Account</div>
                        <div className="menu-item">Help Center</div>
                        <div className="menu-item" onClick={handleSignOut}>
                            Sign out of Netflix
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
    position: relative;
    
    .profile-icon {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        img {
            width: 32px;
            height: 32px;
            border-radius: 4px;
        }
        
        .profile-name {
            color: white;
            font-size: 14px;
            display: none;
            
            @media (min-width: 768px) {
                display: block;
            }
        }
        
        .dropdown-arrow {
            width: 16px;
            height: 16px;
            fill: white;
        }
    }
    
    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: rgba(0, 0, 0, 0.9);
        border: 1px solid #333;
        border-radius: 4px;
        min-width: 200px;
        z-index: 1000;
        
        .profile-section {
            padding: 16px;
            border-bottom: 1px solid #333;
            
            h4 {
                color: white;
                margin: 0 0 12px 0;
                font-size: 14px;
            }
            
            .profile-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 0;
                cursor: pointer;
                border-radius: 4px;
                
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                
                &.active {
                    background-color: rgba(229, 9, 20, 0.2);
                }
                
                img {
                    width: 24px;
                    height: 24px;
                    border-radius: 2px;
                }
                
                span {
                    color: white;
                    font-size: 13px;
                }
            }
        }
        
        .menu-section {
            padding: 8px 0;
            
            .menu-item {
                padding: 8px 16px;
                color: white;
                font-size: 13px;
                cursor: pointer;
                
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }
        }
    }
`;