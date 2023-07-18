import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor() {}

  game: any = {
    correct_tracks: new Set<any>(),
    rounds: []
  };
  numberOfRounds = 1;
  numberOfArtists = 2;
  selectedGenre: String = "";
  genres: string[] = [];

  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    console.log(TOKEN_KEY);
  }

  handleClick() {
    this.assembleGameData(this.token)
    console.log(this.game);
  }

  assembleGameData = async (t: any) => {
    this.configLoading = true;

    while (this.game.rounds.length < this.numberOfRounds) {
      const response = await fetchFromSpotify({
        token: t,
        endpoint: this.createSearchQuery()
      });
      
      if (response.tracks.items[0].preview_url === null) {
        continue;
      }

      let track = {
        artist_name: response.tracks.items[0].artists[0].name,
        preview_url: response.tracks.items[0].preview_url,
        track_name: response.tracks.items[0].name
      }
      this.game.correct_tracks.add(track);

      let artists = new Set<any>();
      
      let pic_url = '';
      try {
        pic_url = response.tracks.items[0].artists[0].images[0].url;
      } catch (e) {
        console.error('no image found')
      }
      let correct_artist = {
        name: track.artist_name,
        pic_url: pic_url
      }
      artists.add(correct_artist);

      let wrongArtists = this.getWrongArtists(this.token, track.artist_name);
      (await wrongArtists).forEach((artist) => artists.add(artist));

      let round = {
        artist_set: artists,
        track: track,
        correct: track.artist_name,
        guessed: ''
      }
      this.game.rounds.push(round);
    }
  }

  createSearchQuery(): string {

    const randomOffset = Math.floor(Math.random() * 500)
    const searchQuery = 'search?q=genre%3A' + this.selectedGenre + '&type=track&offset=' + randomOffset + "&limit=1"

    return searchQuery;
  }

  getWrongArtists = async (t: any, provided_name: string) => {
    this.configLoading = true;

    let artist_set = new Set<any>();
    while (artist_set.size < this.numberOfArtists) {
      const response = await fetchFromSpotify({
        token: t,
        endpoint: this.createSearchQuery()
      });

      let artist_name = response.tracks.items[0].artists[0].name;
    
      if (artist_name === provided_name) {
        continue;
      }

      let picture_url = '';
      try {
        picture_url = response.tracks.items[0].artists[0].images[0].url;
      } catch (e) {
        console.error('no image found')
      }

      let artist = {
        name: artist_name,
        pic_url: picture_url
      }
      artist_set.add(artist);
    }
    return artist_set;
  }
}
