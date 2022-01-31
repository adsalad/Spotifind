import React from "react";
import { Container } from "react-bootstrap";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=ac17c9e0951443858dbcbe0d09ec6f81&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "black" }}
    >
      <a
        className="btn"
        href={AUTH_URL}
        style={{
          backgroundColor: "#1DB954",
          display: "flex",
          width: "300px",
          height: "100px",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 30,
        }}
      >
        Login with Spotify
      </a>
    </Container>
  );
}
