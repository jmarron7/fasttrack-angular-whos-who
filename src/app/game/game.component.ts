import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: any = {
    correct_tracks: new Set<any>(),
    rounds: []
  };
  constructor(private router: Router) { 
    console.log('hey!')
    let input = this.router.getCurrentNavigation();
    this.game = input?.extras?.state?.['game'];
  }

  ngOnInit(): void {
    console.log(this.game);
  }

}
