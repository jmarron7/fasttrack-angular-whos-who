import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const {Howl, Howler} = require('howler');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  buttonLabel = "Play Song"

  game: any = {
    correct_tracks: new Set<any>(),
    rounds: []
  };
  currentRound = 0;
  totalRounds = 0;
  score = 0;
  sound = new Howl({
    src: [],
    html5: false,
    volume: 0,
    onend: function() {}
  });

  constructor(private router: Router) {
    let input = this.router.getCurrentNavigation();
    this.game = input?.extras?.state?.['game'];
  }

  ngOnInit(): void {
    console.log(this.game);
    this.totalRounds = this.game.rounds.length
    this.sound = new Howl({
      src: [this.game.rounds[0].track.preview_url],
      html5: true,
      volume: 1,
      onend: function() {
        console.log("Done")
      }
    });
  }

  handlePlayTrack() {
    console.log('here!')
    
    if (!this.sound.playing()) {
      this.sound.play();
      this.buttonLabel = "Pause Song"
    }
    else {
      this.sound.pause();
      this.buttonLabel = "Play Song"
    }
  }
}
