import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  game: any = {
    rounds: []
  };

  score: number = 0;

  resultData: any = {
    rounds: []
  };

  constructor(private router: Router) {
    let input = this.router.getCurrentNavigation();
    this.game = input?.extras?.state?.['game'];
    this.score = input?.extras?.state?.['score'];
  }

  ngOnInit(): void {
    if (this.game === undefined)
      this.router.navigate(['/']);
    this.assembleResultData();
    console.log(this.resultData);
  }

  assembleResultData() {
    for (let round of this.game.rounds) {
      let choice: any = {
        guessedArtist: round.guessed,
        trackTitle: round.track.trackName,
        spotifyUrl: round.track.spotifyUrl,
        picUrl: (() => {
          let name = round.guessed;
          return round.artistList.find((a: { name: string }) => a.name === name).picUrl;
        })()
      }
      let r: any = {
        choice: choice,
        correct: round.correct,
        guessed: round.guessed
      }
      this.resultData.rounds.push(r);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

}
