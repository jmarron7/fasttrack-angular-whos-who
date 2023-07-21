import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router, NavigationExtras } from '@angular/router';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
  const TOKEN_KEY = "whos-who-access-token";
  
interface Setting {
  name: string,
  label: string,
  amount: number,
  min: number,
  max: number
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  game: any = {
    rounds: []
  };
  
  config: any = {
    genre: '',
    rounds: 0,
    choices: 0
  }

  settings: Setting[] = [
    {
      name: 'numOfRounds',
      label: '# of Rounds',
      amount: 1,
      min: 1,
      max: 3,
    },
    {
      name: 'numOfChoices',
      label: 'Artists per Guess',
      amount: 2,
      min: 2,
      max: 4,
    }
  ]
  
  genres: string[] = [
    "alt-rock",
    "alternative", 
    "anime",
    "bluegrass",
    "blues",
    "classical",
    "country",
    "disco",
    "dubstep",
    "edm",
    "electronic",
    "folk",
    "funk",
    "gospel",
    "hard-rock",
    "hardcore",
    "hip-hop",
    "house",
    "indie",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "metal",
    "opera",
    "pop",
    "punk",
    "r-n-b",
    "reggae",
    "reggaeton",
    "rock",
    "soul",
    "techno"
  ];
  
  apiCallLimit = 45;
  apiCallCount = 0;
  numberOfRounds: number = 1
  numberOfChoices: number = 2
  hasSelectedGenre: boolean = false;
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  gameLoading: boolean = false;
  token: String = "";
  
  constructor(private router:Router) {}
  
  ngOnInit(): void {
    this.configLoading = true;
    let storedConfig = localStorage.getItem('config');
    if (storedConfig != null) {
      this.config = JSON.parse(storedConfig);
      this.numberOfRounds = this.config.rounds;
      this.numberOfChoices = this.config.choices;
      this.selectedGenre = this.config.genre;
      this.settings[0].amount = this.numberOfRounds;
      this.settings[1].amount = this.numberOfChoices;
      if (this.selectedGenre.length === 0) {
        this.hasSelectedGenre = false;
      } else {
        this.hasSelectedGenre = true;
      }
    }
    localStorage.setItem('config', JSON.stringify(this.config));
    this.configLoading = false;
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    console.log("Created token")
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;

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
    });

  }

  // SETTINGS FUNCTIONS
  increment(settingName: string) {
    HomeComponent.bind(this)
    if (this.settings.find((setting) => setting.name === settingName)) {
      this.settings.forEach((setting) => {
        if (setting.name === settingName) {
          setting.amount = setting.amount < setting.max
            ? (setting.amount + 1)
            : (setting.max);
          
          this.updateGameSettings(settingName)
        }
      })
    }
  }

  decrement(settingName: string) {
    HomeComponent.bind(this)
    if (this.settings.find((setting) => setting.name === settingName)) {
      this.settings.forEach((setting) => {
        if (setting.name === settingName) {
          setting.amount = setting.amount > setting.min ? (setting.amount - 1) : setting.min
          this.updateGameSettings(settingName)
        }
      })
    }
  }

  updateGameSettings(settingName: string) {
    if (this.settings.find((setting) => setting.name === settingName)) {
      this.settings.forEach((setting) => {
        if (setting.name === settingName) {
          if(setting.name === "numOfRounds"){
            this.numberOfRounds = setting.amount
          }
          if(setting.name === "numOfChoices"){
            this.numberOfChoices = setting.amount

          }
        }
      })
    }
  }
 
  setGenre(selectedGenre: any) {
    console.log(selectedGenre)
    console.log(selectedGenre.length)
    if(selectedGenre.length === 0) {
      this.hasSelectedGenre = false;
      this.selectedGenre = ''
    } else {
      this.hasSelectedGenre = true;
      this.selectedGenre = selectedGenre;
    }

    this.config.genre = this.selectedGenre;
    localStorage.setItem('config', JSON.stringify(this.config));
  }

  @Output() emitter:EventEmitter<any> = new EventEmitter();


  handleStartGame() {
    this.gameLoading = true;
    this.config.rounds = this.numberOfRounds;
    this.config.choices =  this.numberOfChoices;
    localStorage.setItem('config', JSON.stringify(this.config));
    this.assembleGameData(this.token).then(() => {
      console.log(this.game);
      let navigationExtras: NavigationExtras = {
        state: {
          game: this.game
        }
      };
      this.gameLoading = false;
      this.router.navigate(['/game'], navigationExtras);
    });
  }

  assembleGameData = async (t: any) => {
    this.configLoading = true;

    this.apiCallCount = 0;
    this.game = {
      rounds: []
    };
    
    let trackUrlSet = new Set<string>();
    while (this.game.rounds.length < this.numberOfRounds) {
      if (this.apiCallCount >= this.apiCallLimit) {
        break;
      }
      const response = await fetchFromSpotify({
        token: t,
        endpoint: this.createSearchQuery()
      });

      let previewUrl = '';
      try {
        previewUrl = response.tracks.items[0].preview_url;
      } catch (e) {
        this.apiCallCount++;
        continue;
      }
      if (previewUrl == null) {
        this.apiCallCount++;
        continue;
      } 
      if (trackUrlSet.has(previewUrl)) {
        continue;
      }

      let spotifyUrl = '';
      try {
        spotifyUrl = response.tracks.items[0].external_urls.spotify;
      } catch (e) {
        this.apiCallCount++;
        continue;
      }
      if (previewUrl == null) {
        this.apiCallCount++;
        continue;
      } 

      let track = {
        artistName: response.tracks.items[0].artists[0].name.normalize(),
        previewUrl: previewUrl,
        spotifyUrl: spotifyUrl,
        trackName: response.tracks.items[0].name
      }

      let artists: any[] = [];
      
      let picUrl = '';
      try {
        picUrl = response.tracks.items[0].album.images[0].url;
      } catch (e) {
          this.apiCallCount++;
          continue;
      }

      let correctArtist = {
        name: track.artistName,
        picUrl: picUrl
      }
      artists.push(correctArtist);

      let wrongArtists = this.getWrongArtists(this.token, correctArtist.name, correctArtist.picUrl);
      (await wrongArtists).forEach((artist) => artists.push(artist));

      const shuffle = (array: string[]) => { 
        return array.sort(() => Math.random() - 0.5); 
      }; 

      let round = {
        artistList: shuffle(Array.from(artists)),
        track: track,
        correct: correctArtist.name,
        guessed: ''
      }
      this.game.rounds.push(round);
      this.apiCallCount++;
    }
    if (this.apiCallCount >= this.apiCallLimit) {
      console.error('ApiCallLimit Reached');
    }

  }

  createSearchQuery(): string {

    const randomOffset = Math.floor(Math.random() * 500)
    const searchQuery = 'search?q=genre%3A' + this.selectedGenre + '&type=track&offset=' + randomOffset + "&limit=1"

    return searchQuery;
  }

  getWrongArtists = async (t: any, correctArtistName: string, correctPicUrl: string) => {
    this.configLoading = true;
    let artistList: any[] = [];
    let artistNames = new Set<string>(); 
    artistNames.add(correctArtistName);
    let picUrls = new Set<string>(); 
    picUrls.add(correctPicUrl);
    while (artistList.length < this.numberOfChoices - 1) {
      if (this.apiCallCount >= this.apiCallLimit) {
        break;
      }
      const response = await fetchFromSpotify({
        token: t,
        endpoint: this.createSearchQuery()
      });

      let wrongArtistName = response.tracks.items[0].artists[0].name.normalize();
    
      if (artistNames.has(wrongArtistName)) {
        this.apiCallCount++;
        continue;
      }

      artistNames.add(wrongArtistName);

      let picUrl = '';
      try {
        picUrl = response.tracks.items[0].album.images[0].url;
      } catch (e) {
          this.apiCallCount++;
          continue;
      }
      
      if (picUrls.has(picUrl)) {
          this.apiCallCount++;
          continue;
      }

      let artist = {
        name: wrongArtistName,
        picUrl: picUrl
      }
      artistList.push(artist);
    }
    this.apiCallCount++;
    return artistList;
  }
}
