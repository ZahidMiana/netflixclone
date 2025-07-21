import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchMovies } from "../store";

export default function SelectGenre({ genres, type }) {
  const dispatch = useDispatch();

  const handleGenreChange = (e) => {
    dispatch(
      fetchMovies({
        genres,
        genre: e.target.value,
        type,
      })
    );
  };

  return (
    <Select className="flex" onChange={handleGenreChange}>
      <option value="">All Genres</option>
      {genres.map((genre) => {
        return (
          <option value={genre.id} key={genre.id}>
            {genre.name}
          </option>
        );
      })}
    </Select>
  );
}

const Select = styled.select`
  margin-left: 5rem;
  cursor: pointer;
  font-size: 1.4rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: 1px solid white;
  padding: 0.4rem 1rem;
  border-radius: 0.4rem;
  
  option {
    background-color: #181818;
    color: white;
  }
`;