import ContinueWatching from '../components/ContinueWatching';
import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styled from 'styled-components';
import backgroundImage from '../assets/home.jpg';
import MovieLogo from '../assets/homeTitle.webp';
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGenres, fetchMovies } from '../store';
import CardSlider from '../components/CardSlider';
import FilterDropdown from '../components/FilterDropdown';




export default function Netflix() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('all');
    const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
    const trendingMovies = useSelector((state) => state.netflix.trendingMovies);
    const popularMovies = useSelector((state) => state.netflix.popularMovies);
    const topRatedMovies = useSelector((state) => state.netflix.topRatedMovies);
    const upcomingMovies = useSelector((state) => state.netflix.upcomingMovies);
    const nowPlayingMovies = useSelector((state) => state.netflix.nowPlayingMovies);
    const tvShows = useSelector((state) => state.netflix.tvShows);
    const documentaries = useSelector((state) => state.netflix.documentaries);
    const sciFiMovies = useSelector((state) => state.netflix.sciFiMovies);
    const crowdPleasers = useSelector((state) => state.netflix.crowdPleasers);
    const recommendations = useSelector((state) => state.netflix.recommendations);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGenres());
    }, [dispatch]);

    useEffect(() => {
        if (genresLoaded) {
            // Fetch all categories
            dispatch(fetchMovies({ type: 'trending', category: 'trending', globalFilter }));
            dispatch(fetchMovies({ type: 'popular', category: 'popular', globalFilter }));
            dispatch(fetchMovies({ type: 'top_rated', category: 'top_rated', globalFilter }));
            dispatch(fetchMovies({ type: 'upcoming', category: 'upcoming', globalFilter }));
            dispatch(fetchMovies({ type: 'now_playing', category: 'now_playing', globalFilter }));
            dispatch(fetchMovies({ type: 'tv', category: 'tv', globalFilter }));
            dispatch(fetchMovies({ type: 'documentaries', category: 'documentaries', globalFilter }));
            dispatch(fetchMovies({ type: 'sci_fi', category: 'sci_fi', globalFilter }));
            dispatch(fetchMovies({ type: 'crowd_pleasers', category: 'crowd_pleasers', globalFilter }));
            dispatch(fetchMovies({ type: 'recommendations', category: 'recommendations', globalFilter }));
        }
    }, [genresLoaded, dispatch, globalFilter]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset === 0 ? false : true);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleGlobalFilterChange = (newFilter) => {
        setGlobalFilter(newFilter);
    };

    return (
        <Container>
            <Navbar isScrolled={isScrolled} />
            <div className="hero">
                <img
                    src={backgroundImage}
                    alt="Movie backdrop"
                    className="background-image"
                />

                <div className="container">
                    <div className="logo">
                        <img src={MovieLogo} alt="Movie backdrop" />
                    </div>
                    <div className="buttons flex">
                        <button className="flex j-center a-center" onClick={() => navigate('/player')}>
                            <FaPlay />
                            Play
                        </button>
                        <button className="flex j-center a-center">
                            <AiOutlineInfoCircle />
                            More Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Global Filter */}
            <div className="global-filter">
                <h2>Filter All Content:</h2>
                <FilterDropdown
                    onFilterChange={handleGlobalFilterChange}
                    currentFilter={globalFilter}
                />
            </div>


            <div className="content-rows">
                <ContinueWatching />

                {recommendations?.length > 0 && (
                    <CardSlider
                        data={recommendations}
                        title="We Think You'll Love These"
                    />
                )}

                {trendingMovies?.length > 0 && (
                    <CardSlider
                        data={trendingMovies}
                        title="Trending Now"
                    />
                )}

                {popularMovies?.length > 0 && (
                    <CardSlider
                        data={popularMovies}
                        title="Popular Movies"
                    />
                )}

                {documentaries?.length > 0 && (
                    <CardSlider
                        data={documentaries}
                        title="Documentaries"
                    />
                )}

                {sciFiMovies?.length > 0 && (
                    <CardSlider
                        data={sciFiMovies}
                        title="Futuristic Sci-Fi"
                    />
                )}

                {crowdPleasers?.length > 0 && (
                    <CardSlider
                        data={crowdPleasers}
                        title="Crowd Pleasers"
                    />
                )}

                {topRatedMovies?.length > 0 && (
                    <CardSlider
                        data={topRatedMovies}
                        title="Top Rated"
                    />
                )}

                {upcomingMovies?.length > 0 && (
                    <CardSlider
                        data={upcomingMovies}
                        title="Coming Soon"
                    />
                )}

                {nowPlayingMovies?.length > 0 && (
                    <CardSlider
                        data={nowPlayingMovies}
                        title="Now Playing"
                    />
                )}

                {tvShows?.length > 0 && (
                    <CardSlider
                        data={tvShows}
                        title="TV Shows"
                    />
                )}
            </div>

            <Footer />
        </Container>
    )
}

const Container = styled.div`
    .hero {
        position: relative;
        height: 100vh;
        
        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .container {
            position: absolute;
            bottom: 5rem;
            left: 5rem;
            
            .logo img {
                width: 100%;
                height: 100%;
                max-width: 400px;
            }
            
            .buttons {
                margin: 5rem 0;
                gap: 2rem;
                
                button {
                    font-size: 1.4rem;
                    gap: 1rem;
                    border-radius: 0.2rem;
                    padding: 0.5rem 2rem;
                    border: none;
                    cursor: pointer;
                    transition: 0.3s ease-in-out;
                    
                    &:nth-of-type(1) {
                        background-color: white;
                        color: black;
                        &:hover { background-color: #e6e6e6; }
                    }
                    
                    &:nth-of-type(2) {
                        background-color: rgba(109, 109, 110, 0.7);
                        color: white;
                        &:hover { background-color: rgba(109, 109, 110, 0.9); }
                    }
                }
            }
        }
    }

    .global-filter {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 2rem 5rem;
        background-color: rgba(0, 0, 0, 0.8);
        
        h2 {
            color: white;
            margin: 0;
            font-size: 1.5rem;
        }
    }

    .content-rows {
        background-color: #141414;
        padding-bottom: 2rem;
    }
`;