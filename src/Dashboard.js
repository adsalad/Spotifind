import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import axios from "axios";

const spotifyAPI = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  //reset variables when track is selected
  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data);
      });
  });

  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    spotifyAPI.searchTracks(search).then((res) => {
      setSearchResults(
        res.body.tracks.items.map((track) => {
          //get smallest image from the array of album images returned from Spotify
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });
  }, [search, accessToken]);
  return (
    <Container
      fluid
      className="d-flex flex-column py-2"
      style={{ height: "100vh", backgroundColor: "black" }}
    >
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></Form.Control>
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div
            className="text-center"
            style={{
              whiteSpace: "pre",
              fontSize: 30,
              fontWeight: "bold",
              color: "white",
            }}
          >
            {lyrics}
          </div>
        )}
      </div>
      <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
    </Container>
  );
}
