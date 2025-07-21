import React from "react";
import styled from "styled-components";

export default function NotAvailable() {
  return (
    <Container>
      <h1 className="not-available">
        No Movies available for the selected genre. Please select a different genre.
      </h1>
    </Container>
  );
}

const Container = styled.div`
  .not-available {
    text-align: center;
    margin-top: 4rem;
    color: white;
    font-size: 2rem;
  }
`;