// src/components/FilterDropdown.jsx
import React from 'react';
import styled from 'styled-components';

export default function FilterDropdown({ onFilterChange, currentFilter }) {
    const filterOptions = [
        { value: 'all', label: 'All Content' },
        { value: 'movie', label: 'Movies Only' },
        { value: 'tv', label: 'TV Shows Only' }
    ];

    return (
        <Container>
            <select 
                value={currentFilter} 
                onChange={(e) => onFilterChange(e.target.value)}
                className="filter-dropdown"
            >
                {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Container>
    );
}

const Container = styled.div`
    .filter-dropdown {
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border: 1px solid #333;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
        outline: none;
        min-width: 150px;
        
        &:hover {
            border-color: #555;
        }
        
        &:focus {
            border-color: #e50914;
        }
        
        option {
            background-color: #181818;
            color: white;
            padding: 8px;
        }
    }
`;