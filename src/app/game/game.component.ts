import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
const { Howl } = require('howler');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  buttonLabel = "Play Song"

  game: any = {
    correctTtracks: [],
    rounds: []
  };
  
  currentRound = 0;
  totalRounds = 0;
  score = 0;
  sound = new Howl({
    src: [""],
    html5: true,
    volume: 0.5,
    onend: function() {        
      this.buttonLabel = "Play Song" 
     }
  });

  constructor(private router: Router) {
    let input = this.router.getCurrentNavigation();
    this.game = input?.extras?.state?.['game'];
  }

  ngOnInit(): void {
    console.log(this.game);
    this.totalRounds = this.game.rounds.length
    this.sound = new Howl({
      src: [this.game.rounds[0].track.previewUrl],
      html5: true,
      volume: 0.5,
      onend: function() {
        this.buttonLabel = "Play Song"
      }
    });
  }

  handlePlayTrack() {    
    if (!this.sound.playing()) {
      this.sound.play()
      this.sound.fade(0, 0.8, 5000);
      this.buttonLabel = "Pause Song"
    }
    else {
      this.sound.pause();
      this.buttonLabel = "Play Song"
    }
  }

  chooseOption(optionGuessed: string) {
    GameComponent.bind(this)
    this.game.rounds[this.currentRound].guessed = optionGuessed
    if(optionGuessed == this.game.rounds[this.currentRound].correct) {
      console.log("Correct!")
    } else {
      console.log("Incorrect!")
    }
  }
}
