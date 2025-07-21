import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

function MyList() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [myList, setMyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Load user's list from localStorage
    const savedList = localStorage.getItem('myNetflixList');
    if (savedList) {
      setMyList(JSON.parse(savedList));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset === 0 ? false : true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const removeFromList = (movieId) => {
    const updatedList = myList.filter(movie => movie.id !== movieId);
    setMyList(updatedList);
    localStorage.setItem('myNetflixList', JSON.stringify(updatedList));
  };

  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="content">
        <h1>My List</h1>
        {myList && myList.length > 0 ? (
          <div className="grid">
            {myList.map((movie, index) => (
              <div key={movie.id} className="card-wrapper">
                <Card 
                  movieData={movie} 
                  index={index} 
                  isLiked={true}
                  onRemove={() => removeFromList(movie.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="not-available">
            <h2>Your list is empty</h2>
            <p>Add movies and TV shows to your list by clicking the + icon</p>
            <button onClick={() => navigate('/')}>Browse Content</button>
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    padding: 8rem 5rem 2rem;
    min-height: 100vh;
    background-color: #141414;
    
    h1 {
      color: white;
      font-size: 3rem;
      margin-bottom: 2rem;
      font-weight: 600;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 2rem;
      
      .card-wrapper {
        height: 130px;
      }
    }
    
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
      
      h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      
      p {
        font-size: 1.2rem;
        color: #b3b3b3;
        margin-bottom: 2rem;
      }
      
      button {
        background-color: #e50914;
        color: white;
        border: none;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        
        &:hover {
          background-color: #f40612;
        }
      }
    }
  }
  
  @media (max-width: 1200px) {
    .content {
      padding: 8rem 2rem 2rem;
      
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  }
  
  @media (max-width: 768px) {
    .content {
      padding: 8rem 1rem 2rem;
      
      h1 {
        font-size: 2rem;
      }
      
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  }
`;

export default MyList;