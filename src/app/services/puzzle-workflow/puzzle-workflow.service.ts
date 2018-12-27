import * as cgTypes from 'chessground/types';
import { EventEmitter } from '@angular/core';
import { Api } from 'chessground/api';
import { ChessHelperService } from '../chess-helper.service';

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

export abstract class PuzzleWorkflowService {

  protected chessHelperService = new ChessHelperService();

  constructor(
    protected pieceMoved: EventEmitter<MoveInfo>,
    protected puzzleSolutionStateChanged: EventEmitter<{stateType: PuzzleSolutionStateType, move: ChessJS.Move}>) {}

  handleCgMove(orig: cgTypes.Key, dest: cgTypes.Key) {
    let move = this.convertMove(orig, dest);
    this.pieceMoved.emit({move: move, moveType: MoveType.NormalOnDrop});

    let state = this.getPuzzleSolutionState(move);
    this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.PuzzleDone, move: move});
    this.handlePuzzleSolutionState(move, state);
  }

  abstract convertMove(orig: cgTypes.Key, dest: cgTypes.Key): ChessJS.Move;

  protected abstract getPuzzleSolutionState(move: ChessJS.Move): PuzzleSolutionStateType;

  protected abstract handlePuzzleSolutionState(move: ChessJS.Move, state: PuzzleSolutionStateType);

  protected disableBoardUserMoves(cgApi: Api) {
    cgApi.set({
      draggable: {enabled: false}
    });
  }

  protected updateBoardUiInfo(cgApi: Api, fen: string, turn: 'white' | 'black') {
    cgApi.cancelMove();
    cgApi.set({
      fen: fen,
      turnColor: turn,
      movable: {
        color: turn,
        dests: this.chessHelperService.getChessgroundPossibleDests(fen)
      },
      draggable: {enabled: true}
    });
  }
}
