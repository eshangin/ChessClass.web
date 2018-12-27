import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {ChessPuzzle, ChessHelperService} from 'src/app/services/chess-helper.service';
import { Api } from 'chessground/api';
import * as cgTypes from 'chessground/types';
import { Config } from 'chessground/config';
import * as Chess from 'chess.js';
import { MoveInfo, PuzzleSolutionStateType, PuzzleWorkflowService } from 'src/app/services/puzzle-workflow/puzzle-workflow.service';
import { StandardPuzzleWorkflowService } from 'src/app/services/puzzle-workflow/standard-puzzle-workflow.service';

@Component({
  selector: 'app-standard-puzzle',
  templateUrl: './standard-puzzle.component.html',
  styleUrls: ['./standard-puzzle.component.scss']
})
export class StandardPuzzleComponent implements OnChanges {

  boardConfig: Config;
  @Input() pgn: string;
  @Output() private puzzleSolutionStateChanged = new EventEmitter<{stateType: PuzzleSolutionStateType, move: ChessJS.Move}>();
  @Output() private pieceMoved = new EventEmitter<MoveInfo>();
  private puzzleInfo: ChessPuzzle;
  private initialFenInfo: {
    dests: {
      [key: string]: cgTypes.Key[];
    },
    turn: 'white' | 'black'
  };
  private puzzleWorkflowService: PuzzleWorkflowService;
  private cgApi: Api;

  constructor(
    private chessHelperService: ChessHelperService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pgn) {
      this.init();
    }
  }

  private init() {
    this.puzzleInfo = this.chessHelperService.parsePuzzle(this.pgn);
    let fen = this.puzzleInfo.initialFen;

    this.initialFenInfo = {
      dests: this.chessHelperService.getChessgroundPossibleDests(fen),
      turn: new Chess(fen).turn() == 'w' ? 'white' : 'black'
    };
    this.boardConfig = { 
      fen: fen,
      turnColor: this.initialFenInfo.turn,
      movable: {
        dests: this.initialFenInfo.dests,
        color: this.initialFenInfo.turn,
        free: false,
        showDests: false,
        events: {
          after: (orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) => 
            this.onMove(orig, dest, metadata)
        }
      },
      draggable: {
        enabled: true
      },
      selectable: {
        enabled: false
      },
      lastMove: null
    };
    this.tryInitWorkflow();
  }

  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
    this.tryInitWorkflow();
  }

  private tryInitWorkflow() {
    if (this.cgApi) {
      this.puzzleWorkflowService = new StandardPuzzleWorkflowService(this.pgn, this.cgApi, this.pieceMoved, this.puzzleSolutionStateChanged);
    }
  }

  private onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    this.puzzleWorkflowService.handleCgMove(orig, dest);
  }
}
