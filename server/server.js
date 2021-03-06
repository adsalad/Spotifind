require("dotenv").config();
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require("lyrics-finder");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//refresh token so user does not have to sign in after 3600 seconds
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    refreshToken, //passed back down to useAuth to regain access to resource server
  });

  spotifyAPI.refreshAccessToken().then(
    (data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    },
    (err) => {
      console.log(err);
      res.sendStatus(400);
    }
  );
});

//retreive OAuth tokens to securely gain access to Spotify API 
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
  });

  spotifyAPI
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

//retreive lyrics from API
app.get("/lyrics", async (req, res) => {
  console.log(req)
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics Retrieved";
  res.json(lyrics);
});

app.listen(3001);
