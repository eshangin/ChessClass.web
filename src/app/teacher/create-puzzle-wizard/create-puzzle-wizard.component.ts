import { Component, OnInit, AfterViewChecked, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import * as cgTypes from 'chessground/types';
import * as Chess from 'chess.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface ICreatePuzzleResult {
  pgn: string;
  description: string;
}

@Component({
  selector: 'app-create-puzzle-wizard',
  templateUrl: './create-puzzle-wizard.component.html',
  styleUrls: ['./create-puzzle-wizard.component.scss']
})
export class CreatePuzzleWizardComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() stepNumber: 1 | 2 | 3 | 4 = 1;
  @Input() formGroup: FormGroup;
  private editorCgApi: Api;
  private recorderCgApi: Api;
  recorderCgConfig: Config;
  private editorResized = false;
  private recorderResized = false;
  engine: ChessInstance = new Chess();
  recorderMoves: string[] = [];
  recorderBlackStartsGame = false;
  @Output() puzzleCreated = new EventEmitter<ICreatePuzzleResult>();
  private PUZZLE_DESCRIPTION_CONROL_NAME = "puzzleDescr";

  constructor(private chessHelperService: ChessHelperService) { }

  ngOnInit() {    
  }

  get puzzleDescr() { return this.formGroup.get(this.PUZZLE_DESCRIPTION_CONROL_NAME); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.stepNumber) {
      switch (this.stepNumber) {
        case 2:
          this.setRecorderConfig(this.editorCgApi.getFen());
          break;
        case 3:
          this.formGroup.addControl(this.PUZZLE_DESCRIPTION_CONROL_NAME, new FormControl('', Validators.required));
          break;
        case 4:
          this.puzzleCreated.emit({pgn: this.engine.pgn(), description: this.puzzleDescr.value} as ICreatePuzzleResult);
          break;
      }
    }
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

  cancelLastRecorderMove() {
    this.recorderMoves.pop();
    let move = this.engine.undo();
    let prevMove: { from: cgTypes.Key, to: cgTypes.Key };
    let history = this.engine.history({verbose: true});
    if (history.length > 0) {
      let lastMove = history[history.length - 1];
      prevMove = {
        from: lastMove.from  as cgTypes.Key,
        to: lastMove.to  as cgTypes.Key
      };
    }
    let cgMove = { from: move.from as cgTypes.Key, to: move.to as cgTypes.Key };
    this.undoCgMove(this.recorderCgApi, cgMove, prevMove);
    this.prepareCgForNextMove(this.recorderCgApi, this.engine);
  }

  private prepareCgForNextMove(cg: Api, engine: ChessInstance) {
    let nextColorToMove: cgTypes.Color | 'both' = 
      engine.history().length == 0
        ? 'both'
        : engine.turn() == 'b' ? 'black' : 'white';
    let dests = this.chessHelperService.getChessgroundPossibleDests(engine.fen());
    cg.set({
      turnColor: nextColorToMove == 'both' ? undefined : nextColorToMove,
      movable: {
        color: nextColorToMove,
        free: nextColorToMove == 'both',
        dests: dests
      }
    });
  }

  private onRecorderMove(initialFen: string, orig: cgTypes.Key, dest: cgTypes.Key) {
    let isCorrectPosition = true;
    if (this.recorderMoves.length == 0) {
      let chessColor = this.detectWhoStartGame(initialFen, orig);
      if (this.engine.load(this.chessHelperService.tryFixFen(initialFen, chessColor))) {
        this.recorderBlackStartsGame = chessColor == 'b';        
      } else {
        console.log('incorrect position', initialFen);
        isCorrectPosition = false;
      }
    }
    if (isCorrectPosition) {
      let move = this.engine.move({from: orig, to: dest});
      if (move) {
        this.recorderMoves.push(move.san);
        this.prepareCgForNextMove(this.recorderCgApi, this.engine);
      } else {
        this.undoCgMove(this.recorderCgApi, { from: orig, to: dest });
      }
    }
  }

  private undoCgMove(cg: Api, move: { from: cgTypes.Key, to: cgTypes.Key }, prevMove?: { from: cgTypes.Key, to: cgTypes.Key }) {
    cg.move(move.to, move.from);
    cg.set({
      lastMove: prevMove ? [prevMove.from, prevMove.to] : undefined
    })
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
        showDests: false,
        events: {
          after: (orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) => 
            this.onRecorderMove(fen, orig, dest)
        }
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
      resizable: true
    };
  }

}
