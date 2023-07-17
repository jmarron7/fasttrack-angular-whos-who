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
  testArr = new Set<any>()
  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
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

  getTrack = async (t: any) => {
    console.log("loadTrack()")
    this.configLoading = true;

    for (let i = 0; i < 10; i++) {
      const searchQuery = this.createSearchQuery()
      console.log(searchQuery)
      const response = await fetchFromSpotify({
        token: t,
        endpoint: searchQuery
      });
      console.log(response)
      for (let track of response.tracks.items) {
        this.testArr.add(track.name)
      }
      console.log(this.testArr)
    }
}

  handleClick() {
    this.getTrack(this.token);
  }

  createSearchQuery(): string {

    const randomOffset = Math.floor(Math.random() * 500)
    const searchQuery = 'search?q=genre%3A' + this.selectedGenre + '&type=track&offset=' + randomOffset + "&limit=1"

    return searchQuery;
  }
}
