import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { searchMovies } from '../store';

export default function Search() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            dispatch(searchMovies({ query }));
        }
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };

        if (isSearchOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => document.removeEventListener('keydown', handleEscape);
    }, [isSearchOpen]);

    return (
        <Container className={isSearchOpen ? 'open' : ''}>
            {!isSearchOpen ? (
                <FaSearch 
                    className="search-icon" 
                    onClick={toggleSearch}
                />
            ) : (
                <div className="search-container">
                    <FaSearch className="search-icon-input" />
                    <input
                        type="text"
                        placeholder="Titles, people, genres"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        autoFocus
                    />
                    <FaTimes 
                        className="close-icon" 
                        onClick={toggleSearch}
                    />
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
    .search-icon {
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: color 0.3s ease;
        
        &:hover {
            color: #b3b3b3;
        }
    }
    
    .search-container {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid white;
        padding: 8px 12px;
        border-radius: 2px;
        gap: 8px;
        min-width: 250px;
        
        .search-icon-input {
            color: white;
            font-size: 16px;
        }
        
        input {
            background: transparent;
            border: none;
            color: white;
            font-size: 14px;
            outline: none;
            flex: 1;
            
            &::placeholder {
                color: #b3b3b3;
            }
        }
        
        .close-icon {
            color: white;
            font-size: 16px;
            cursor: pointer;
            
            &:hover {
                color: #b3b3b3;
            }
        }
    }
    
    @media (max-width: 768px) {
        &.open {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            z-index: 100;
            
            .search-container {
                min-width: 100%;
                margin: 8px;
            }
        }
    }
`;