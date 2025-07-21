import {
    configureStore,
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "537bbf5f5229569de444b2b7943f1ee9";

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
    trendingMovies: [],
    popularMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
    nowPlayingMovies: [],
    tvShows: [],
    documentaries: [],
    sciFiMovies: [],
    crowdPleasers: [],
    recommendations: [],
    searchResults: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async() => {
    const {data} = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return data.genres;
});


// Add search function
export const searchMovies = createAsyncThunk(
  "netflix/search",
  async ({ query }, thunkApi) => {
    const {
      netflix: { genres },
    } = thunkApi.getState();
    
    const url = `${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    
    console.log("Searching with URL:", url);
    const data = await getRawData(url, genres, true);
    return data;
  }
);

const createArrayFromRawData = (array, moviesArray, genres) => {
    array.forEach((movie) => {
        const movieGenres = [];
        movie.genre_ids.forEach((genre) => {
            const name = genres.find(({id}) => id === genre);
            if(name) movieGenres.push(name.name);
        });
        if (movie.backdrop_path){
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
                media_type: movie.media_type || 'movie',
                // Add a placeholder for trailer that will be populated later
                trailerUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // Default placeholder
            });
        }
    });
};


// Add a new async thunk to fetch trailers
export const fetchTrailers = createAsyncThunk(
  "netflix/fetchTrailers",
  async (_, thunkApi) => {
    const {
      netflix: { movies, trendingMovies, popularMovies, topRatedMovies, upcomingMovies, tvShows }
    } = thunkApi.getState();
    
    // Combine all movie arrays for batch processing
    const allMovies = [
      ...movies, 
      ...trendingMovies, 
      ...popularMovies, 
      ...topRatedMovies, 
      ...upcomingMovies, 
      ...tvShows
    ];
    
    // Get unique movies by ID
    const uniqueMovies = [...new Map(allMovies.map(item => [item.id, item])).values()];
    
    // Fetch trailers for each movie/show (in batches to avoid rate limiting)
    const moviesWithTrailers = await Promise.all(
      uniqueMovies.map(async (movie) => {
        try {
          const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
          const { data } = await axios.get(
            `${TMDB_BASE_URL}/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`
          );
          
          // Find trailer or teaser or any video
          const trailer = data.results.find(video => 
            video.type === 'Trailer' || video.type === 'Teaser'
          );
          
          if (trailer) {
            return {
              ...movie,
              trailerUrl: `https://www.youtube.com/watch?v=${trailer.key}`
            };
          }
          return movie;
        } catch (error) {
          console.log('Error fetching trailer:', error);
          return movie;
        }
      })
    );
    
    return moviesWithTrailers;
  }
);

const getRawData = async (api, genres, paging) => {
    const moviesArray = [];
    for(let i = 1; moviesArray.length < 60 && i < 10; i++) {
        try {
            const { data: result } = await axios.get(
                `${api}${paging ? `&page=${i}` : ""}`
            );
            createArrayFromRawData(result.results, moviesArray, genres);
        } catch (error) {
            console.error('Error fetching data:', error);
            break;
        }
    }
    return moviesArray;
};

export const fetchMovies = createAsyncThunk(
  "netflix/fetchMovies",
  async ({ type, category, globalFilter }, thunkApi) => {
    const {
      netflix: { genres },
    } = thunkApi.getState();
    
    let url;
    let mediaType = globalFilter === 'tv' ? 'tv' : 'movie';
    
    switch(type) {
      case 'trending':
        url = `${TMDB_BASE_URL}/trending/${globalFilter === 'all' ? 'all' : mediaType}/week?api_key=${API_KEY}`;
        break;
      case 'popular':
        url = `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${API_KEY}`;
        break;
      case 'top_rated':
        url = `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}`;
        break;
      case 'upcoming':
        url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}`;
        break;
      case 'now_playing':
        url = `${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
        break;
      case 'tv':
        url = `${TMDB_BASE_URL}/tv/popular?api_key=${API_KEY}`;
        break;
      case 'documentaries':
        url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=99`;
        break;
      case 'sci_fi':
        url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=878`;
        break;
      case 'crowd_pleasers':
        url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=1000`;
        break;
      case 'recommendations':
        url = `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${API_KEY}&sort_by=popularity.desc`;
        break;
      default:
        url = `${TMDB_BASE_URL}/trending/all/week?api_key=${API_KEY}`;
    }
    
    console.log("Fetching from URL:", url);
    const data = await getRawData(url, genres, true);
    return { data, category };
  }
);

const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.genresLoaded = true;
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            const { data, category } = action.payload;
            switch(category) {
                case 'trending':
                    state.trendingMovies = data;
                    break;
                case 'popular':
                    state.popularMovies = data;
                    break;
                case 'top_rated':
                    state.topRatedMovies = data;
                    break;
                case 'upcoming':
                    state.upcomingMovies = data;
                    break;
                case 'now_playing':
                    state.nowPlayingMovies = data;
                    break;
                case 'tv':
                    state.tvShows = data;
                    break;
                case 'documentaries':
                    state.documentaries = data;
                    break;
                case 'sci_fi':
                    state.sciFiMovies = data;
                    break;
                case 'crowd_pleasers':
                    state.crowdPleasers = data;
                    break;
                case 'recommendations':
                    state.recommendations = data;
                    break;
                default:
                    state.movies = data;
            }
        });
        builder.addCase(searchMovies.fulfilled, (state, action) => {
            state.searchResults = action.payload;
        });
    },
});

export const { clearSearchResults } = NetflixSlice.actions;

export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer,
    },
});