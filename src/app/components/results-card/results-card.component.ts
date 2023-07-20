import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-results-card',
  templateUrl: './results-card.component.html',
  styleUrls: ['./results-card.component.css']
})
export class ResultsCardComponent implements OnInit {

  @Input() index: number = 0;
  @Input() round: any;
   wasCorrect: boolean = false;
  title: string = "";
  picUrl: string = "";
  guessedName: string = "";
  correctName:string = "";

  constructor() { }

  ngOnInit(): void {
    this.correctName = this.round.correct;
    this.guessedName = this.round.guessed;
    this.title = this.round.choice.trackTitle;
    this.picUrl = this.round.choice.picUrl;
    this.wasCorrect = this.correctName === this.guessedName;
  }

}
