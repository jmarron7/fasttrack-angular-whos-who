import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
const { Howl } = require('howler');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  isPlaying = false
  game: any = {
    rounds: []
  };
  
  currentRound = 0;
  totalRounds = 0;
  score = 0;
  sound = new Howl({
    src: [""],
    html5: true,
    volume: 0.5,
  });
  hasChosen = false;
  isCorrect = false;

  constructor(private router: Router) {
    let input = this.router.getCurrentNavigation();
    this.game = input?.extras?.state?.['game'];
  }

  ngOnInit(): void {
    if (this.game === undefined) {
      this.router.navigate(['/']);
    } else {
      this.totalRounds = this.game.rounds.length
      this.setSound();
    }
  }

  handlePlayTrack() {    
    if (!this.sound.playing()) {
      this.sound.play()
      this.sound.fade(0, 0.8, 5000);
      this.isPlaying = true
    }
    else {
      this.sound.pause();
      this.isPlaying = false
    }
    
  }

  setSound() {
    this.sound = new Howl({
      src: [this.game.rounds[this.currentRound].track.previewUrl],
      html5: true,
      volume: 0.5,
  });
    this.sound.on('end', () => {
      this.isPlaying = false
    });
  }


  chooseOption(optionGuessed: string) {
    GameComponent.bind(this)
    this.game.rounds[this.currentRound].guessed = optionGuessed
      if (!this.hasChosen) {
        if(optionGuessed === this.game.rounds[this.currentRound].correct) {
          this.isCorrect = true;      
          this.score++
        } else {
          this.isCorrect = false;
        }
    } 
    this.sound.stop();
    this.isPlaying = false;
    this.hasChosen = true;
  }

  nextRound() {
    this.hasChosen = false;
    this.currentRound++
    this.setSound();
  }

  goToResults() {
    let navigationExtras: NavigationExtras = {
      state: {
        game: this.game,
        score: this.score
      }
    };
    this.router.navigate(['/results'], navigationExtras);
  }

}
