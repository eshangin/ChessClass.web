import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-puzzle',
  templateUrl: './create-puzzle.component.html',
  styleUrls: ['./create-puzzle.component.scss']
})
export class CreatePuzzleComponent implements OnInit {

  fen: string;
  stepName: 'place-figures' | 'record-solution' = 'place-figures';

  constructor() { }

  ngOnInit() {
    this.fen = '8/8/8/8/8/8/8/8';
  }

  goToStep(stepName: 'place-figures' | 'record-solution') {
    this.stepName = stepName;
    console.log(this.fen)
  }

}
