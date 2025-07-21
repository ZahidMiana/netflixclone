import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <Container>
            <div className="footer-content">
                <div className="social-links">
                    <FaFacebookF />
                    <FaInstagram />
                    <FaTwitter />
                    <FaYoutube />
                </div>

                <div className="link-grid">
                    <div className="link-column">
                        <a href="#audio">Audio Description</a>
                        <a href="#relations">Investor Relations</a>
                        <a href="#legal">Legal Notices</a>
                    </div>
                    <div className="link-column">
                        <a href="#help">Help Center</a>
                        <a href="#jobs">Jobs</a>
                        <a href="#cookies">Cookie Preferences</a>
                    </div>
                    <div className="link-column">
                        <a href="#gift">Gift Cards</a>
                        <a href="#terms">Terms of Use</a>
                        <a href="#info">Corporate Information</a>
                    </div>
                    <div className="link-column">
                        <a href="#media">Media Center</a>
                        <a href="#privacy">Privacy</a>
                        <a href="#contact">Contact Us</a>
                    </div>
                </div>

                <div className="service-code">
                    <button>Service Code</button>
                </div>

                <div className="copyright">
                    © 1997-2024 Netflix, Inc.
                </div>
            </div>

            <div className="disclaimer">
                <p>
                    This is an educational project demonstrating UI/UX design and web development skills.
                    Mianaflix is not a real streaming service and only shows movie trailers.
                    All movie data is provided by TMDB API for demonstration purposes only.
                </p>
            </div>
        </Container>
    );
}

const Container = styled.footer`
    background-color: #141414;
    padding: 50px 0;
    margin-top: 50px;
    
    .footer-content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 50px;
        
        .social-links {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            
            svg {
                font-size: 24px;
                color: #737373;
                cursor: pointer;
                transition: color 0.3s ease;
                
                &:hover {
                    color: white;
                }
            }
        }
        
        .link-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
            
            .link-column {
                display: flex;
                flex-direction: column;
                gap: 15px;
                
                a {
                    color: #737373;
                    text-decoration: none;
                    font-size: 13px;
                    
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
        
        .service-code {
            margin-bottom: 20px;
            
            button {
                background: transparent;
                border: 1px solid #737373;
                color: #737373;
                padding: 8px 12px;
                font-size: 13px;
                cursor: pointer;
                
                &:hover {
                    color: white;
                    border-color: white;
                }
            }
        }
        
        .copyright {
            color: #737373;
            font-size: 13px;
        }
    }
    
    @media (max-width: 768px) {
        .footer-content {
            padding: 0 20px;
            
            .link-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    }
    
    @media (max-width: 480px) {
        .footer-content {
            .link-grid {
                grid-template-columns: 1fr;
            }
        }
    }


    // Add this to the styled component
.disclaimer {
    margin-top: 20px;
    border-top: 1px solid #333;
    padding-top: 20px;
    
    p {
        color: #737373;
        font-size: 12px;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }
}

    

`;