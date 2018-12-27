import { Api } from "chessground/api";
import { Config } from "chessground/config";
import { EventEmitter, Output } from "@angular/core";
import * as cgTypes from 'chessground/types';
import { ChessHelperService } from "src/app/services/chess-helper.service";
import * as Chess from 'chess.js';

export interface IMoveInfo {
  stateType: PuzzleSolutionStateType,
  move: ChessJS.Move
}

export interface IInitializedInfo {
    fen: string;
}

export enum PuzzleSolutionStateType {
  CorrectMove = 1,
  PuzzleDone,
  IncorrectMove
}

export interface MoveInfo {
  move: ChessJS.Move;
  moveType: MoveType;
}

export enum MoveType {
  NormalOnDrop = 1,
  NormalProgrammatic,
  Undo,
  UndoAll
}

export abstract class PuzzleViewerComponent {

  protected cgApi: Api;
  boardConfig: Config;
  @Output() boardInit = new EventEmitter<Api>();
  @Output() initialized = new EventEmitter<IInitializedInfo>();
  @Output() protected puzzleSolutionStateChanged = new EventEmitter<{stateType: PuzzleSolutionStateType, move: ChessJS.Move}>();
  @Output() protected pieceMoved = new EventEmitter<MoveInfo>();
  protected initialFenInfo: {
      dests: {
          [key: string]: cgTypes.Key[];
      },
      turn: 'white' | 'black'
  };

  constructor(protected chessHelperService: ChessHelperService) {}

  protected init(fen: string) {
    this.initialFenInfo = {
      dests: this.chessHelperService.getChessgroundPossibleDests(fen),
      turn: new Chess(fen).turn() == 'w' ? 'white' : 'black'
    };
    this.boardConfig = { 
      fen: fen,
      turnColor: this.initialFenInfo.turn,
      check: false,
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
      lastMove: null,
      events: {
        move: (orig: cgTypes.Key, dest: cgTypes.Key, capturedPiece?: cgTypes.Piece) => {
          this.cgApi.set({ check: this.chessHelperService.isCgInCheck(this.cgApi) });
        }
      }
    };
    this.initialized.emit({ fen: fen });
  }
  
  onBoardInit(cgApi: Api) {
    this.cgApi = cgApi;
    this.boardInit.emit(cgApi);
  }
  
  protected onMove(orig: cgTypes.Key, dest: cgTypes.Key, metadata: cgTypes.MoveMetadata) {
    let move = this.convertMove(orig, dest);
    this.pieceMoved.emit({move: move, moveType: MoveType.NormalOnDrop});

    let state = this.getPuzzleSolutionState(move);
    this.puzzleSolutionStateChanged.emit({stateType: state, move: move});
    this.handlePuzzleSolutionState(move, state);
  }

  abstract getPuzzleSolutionState(move: ChessJS.Move): PuzzleSolutionStateType;

  protected disableBoardUserMoves() {
    this.cgApi.set({
      draggable: {enabled: false}
    });
  }

  protected makeBoardMove(orig: cgTypes.Key, dest: cgTypes.Key, newDests: { [key: string]: cgTypes.Key[] }, turn: 'white' | 'black') {
    this.cgApi.move(orig, dest);
    this.cgApi.set({
      turnColor: turn,
      movable: {
        color: turn,
        dests: newDests
      },
      draggable: {enabled: true}
    });
  }

  abstract convertMove(orig: cgTypes.Key, dest: cgTypes.Key): ChessJS.Move;

  abstract handlePuzzleSolutionState(move: ChessJS.Move, state: PuzzleSolutionStateType);
}