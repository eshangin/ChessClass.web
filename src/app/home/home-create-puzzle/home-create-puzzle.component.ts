import { Component, OnInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import * as cgTypes from 'chessground/types';
import * as Chess from 'chess.js';
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import _ from 'underscore'

@Component({
  selector: 'app-home-create-puzzle',
  templateUrl: './home-create-puzzle.component.html',
  styleUrls: ['./home-create-puzzle.component.scss']
})
export class HomeCreatePuzzleComponent implements OnInit, AfterViewChecked {

  private editorCgApi: Api;
  private recorderCgApi: Api;
  recorderCgConfig: Config;
  stepNumber: 1 | 2 | 3 = 1;
  private editorResized = false;
  private recorderResized = false;
  engine: ChessInstance = new Chess();
  recorderMoves: string[] = [];
  recorderBlackStartsGame = false;
  @Output() puzzleCreated = new EventEmitter<{pgn: string, description: string}>();

  constructor(private chessHelperService: ChessHelperService) { }

  ngOnInit() {
  }

  goToNextStep() {
    if (this.stepNumber == 3) {
      this.puzzleCreated.emit({pgn: this.engine.pgn(), description: 'TODO'});
    }
    this.stepNumber++;
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
    let move = this.engine.move({from: orig, to: dest});
    if (move) {
      this.recorderMoves.push(move.san);
       let nextColorToMove: cgTypes.Color = move.color == 'w' ? 'black' : 'white';
       let dests = this.chessHelperService.getChessgroundPossibleDests(this.engine);
       this.recorderCgApi.set({
         turnColor: nextColorToMove,
         movable: {
           color: nextColorToMove,
           free: false,
           dests: dests
         }
       })
    } else {
      this.recorderCgApi.cancelMove();
    }
  }

  private detectWhoStartGame(initialFen: string, orig: cgTypes.Key): ChessJS.Types.ChessColor {
    let c1 = new Chess();
    c1.load(this.chessHelperService.tryFixFen(initialFen));
    return c1.get(orig).color;
  }

  private setRecorderConfig(fen: string) {
    
    this.recorderCgConfig = {
      fen: fen,
      movable: {
        free: true,
        color: 'both',
        showDests: false
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
