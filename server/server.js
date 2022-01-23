const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.post("/login", (req, res) => {
  const spotifyAPI = SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientSecret: '8a31968f7d20444fac415e9e3ff0b5c1',
    clientId: 'ac17c9e0951443858dbcbe0d09ec6f81'

  })

});
