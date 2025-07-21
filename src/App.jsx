import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './utils/firebase-config';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Netflix from './pages/Netflix';
import Player from './pages/Player';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MyList from './pages/MyList';
import SearchResults from './pages/SearchResults';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrailers } from './store';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch trailers once genres are loaded
  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchTrailers());
    }
  }, [genresLoaded, dispatch]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#141414',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <Netflix /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/player" 
          element={user ? <Player /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/movies" 
          element={user ? <Movies /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/tv" 
          element={user ? <TVShows /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/mylist" 
          element={user ? <MyList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/search" 
          element={user ? <SearchResults /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;