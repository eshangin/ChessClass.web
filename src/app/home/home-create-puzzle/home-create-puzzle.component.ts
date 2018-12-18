import { Component, OnInit } from '@angular/core';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';

@Component({
  selector: 'app-home-create-puzzle',
  templateUrl: './home-create-puzzle.component.html',
  styleUrls: ['./home-create-puzzle.component.scss']
})
export class HomeCreatePuzzleComponent implements OnInit {

  cgApi: Api;
  recorderCgConfig: Config;
  stepNumber: 1 | 2 = 1;

  constructor() { }

  ngOnInit() {
  }

  goToStep(stepNumber: 1 | 2) {
    this.stepNumber = stepNumber;
    this.setRecorderConfig(this.cgApi.getFen());
  }

  onEditorInitialized(cgApi: Api) {
    this.cgApi = cgApi;
  }

  private setRecorderConfig(fen: string) {
    this.recorderCgConfig = {
      fen: fen,
      movable: {
        free: true,
        color: 'both'
      },
      premovable: {
        enabled: true
      },
      drawable: {
        enabled: true
      },
      draggable: {
        showGhost: true,
        distance: 0,
        autoDistance: false
      },
      highlight: {
        lastMove: true
      },
      resizable: true
    };
  }

}
