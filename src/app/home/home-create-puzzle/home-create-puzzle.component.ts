import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import * as cgTypes from 'chessground/types';
import * as Chess from 'chess.js';
import { ChessHelperService } from 'src/app/services/chess-helper.service';

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
  engine: ChessInstance = new Chess();
  recorderMoves: string[] = [];
  recorderBlackStartsGame = false;

  constructor(private chessHelperService: ChessHelperService) { }

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
          setTimeout(() => {
            this.editorCgApi.redrawAll();
          }, 0);
        }        
        break;
      case 2:
        if (!this.recorderResized) {
          this.recorderResized = true;
          setTimeout(() => {
            this.recorderCgApi.redrawAll();  
          }, 0);
        }
        break;
    }
  }

  private onRecorderMove(initialFen: string, orig: cgTypes.Key, dest: cgTypes.Key, capturedPiece?: cgTypes.Piece) {
    if (this.recorderMoves.length == 0) {
      let chessColor = this.detectWhoStartGame(initialFen, orig);
      if (this.engine.load(this.chessHelperService.tryFixFen(initialFen, chessColor))) {
        this.recorderBlackStartsGame = chessColor == 'b';        
      } else {
        console.log('incorrect position', initialFen);
      }
    }
    //console.log(orig, dest, capturedPiece);
    let move = this.engine.move({from: orig, to: dest});
    // console.log(move);
    if (move) {
       this.recorderMoves.push(move.san);      
    }
  }

  private detectWhoStartGame(initialFen: string, orig: cgTypes.Key): ChessJS.Types.ChessColor {
    let c1 = new Chess();
    c1.load(initialFen);
    return c1.get(orig).color;
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
        lastMove: true
      },
      resizable: true,
      events: {
        move: (orig: cgTypes.Key, dest: cgTypes.Key, capturedPiece?: cgTypes.Piece) => 
          this.onRecorderMove(fen, orig, dest, capturedPiece)
      }
    };
  }

}
