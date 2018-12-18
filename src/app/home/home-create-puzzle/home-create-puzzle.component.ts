import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';

@Component({
  selector: 'app-home-create-puzzle',
  templateUrl: './home-create-puzzle.component.html',
  styleUrls: ['./home-create-puzzle.component.scss']
})
export class HomeCreatePuzzleComponent implements OnInit, AfterViewChecked {

  private editorCgApi: Api;
  private recorderCgApi: Api;
  recorderCgConfig: Config;
  stepNumber: 1 | 2 = 1;
  private editorResized = false;
  private recorderResized = false;

  constructor() { }

  ngOnInit() {
  }

  goToStep(stepNumber: 1 | 2) {
    this.stepNumber = stepNumber;
    this.setRecorderConfig(this.editorCgApi.getFen());
  }

  onEditorInitialized(cgApi: Api) {
    this.editorCgApi = cgApi;
  }

  onRecorderInitialized(cgApi: Api) {
    this.recorderCgApi = cgApi;
  }

  ngAfterViewChecked(): void {
    switch (this.stepNumber) {
      case 1:
        if (!this.editorResized) {
          this.editorResized = true;
          this.editorCgApi.redrawAll();
        }        
        break;
      case 2:
        if (!this.recorderResized) {
          this.recorderResized = true;
          this.recorderCgApi.redrawAll();
        }
        break;
    }
  }

  private setRecorderConfig(fen: string) {
    this.recorderCgConfig = {
      fen: fen,
      movable: {
        free: true,
        color: 'both'
      },
      premovable: {
        enabled: false
      },
      drawable: {
        enabled: true
      },
      draggable: {
        showGhost: true,
        distance: 0,
        autoDistance: false,
        deleteOnDropOff: true,
        centerPiece: true
      },
      highlight: {
        lastMove: false
      },
      resizable: true
    };
  }

}
