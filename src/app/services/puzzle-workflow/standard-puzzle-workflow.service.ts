import { PuzzleWorkflowService, PuzzleSolutionStateType, MoveInfo, MoveType } from "./puzzle-workflow.service";
import { EventEmitter } from "@angular/core";
import * as cgTypes from 'chessground/types';
import * as Chess from 'chess.js';
import { ChessPuzzle } from "../chess-helper.service";
import { Api } from "chessground/api";

export class StandardPuzzleWorkflowService extends PuzzleWorkflowService {

    private engine: ChessInstance = new Chess();
    private puzzleInfo: ChessPuzzle;

    constructor(        
        pgn: string,
        private cgApi: Api,
        pieceMoved: EventEmitter<MoveInfo>,
        puzzleSolutionStateChanged: EventEmitter<{stateType: PuzzleSolutionStateType, move: ChessJS.Move}>) {

        super(pieceMoved, puzzleSolutionStateChanged);
        this.puzzleInfo = this.chessHelperService.parsePuzzle(pgn);
        this.engine.load(this.puzzleInfo.initialFen);
    }

    getPuzzleSolutionState(move: ChessJS.Move): PuzzleSolutionStateType {
        this.engine.move(move);
        if (this.isCorrectPuzzleMove(this.puzzleInfo, this.engine)) {
            return (this.puzzleInfo.solutionMovements.length == this.engine.history().length)
                ? PuzzleSolutionStateType.PuzzleDone
                : PuzzleSolutionStateType.CorrectMove;
        }

        return PuzzleSolutionStateType.IncorrectMove;
    }    
    
    handlePuzzleSolutionState(move: ChessJS.Move, state: PuzzleSolutionStateType) {
        switch (state) {
            case PuzzleSolutionStateType.PuzzleDone:
                this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.PuzzleDone, move: move});
                break;
            case PuzzleSolutionStateType.CorrectMove:
                this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.CorrectMove, move: move});
                this.disableBoardUserMoves(this.cgApi);
                setTimeout(() => {
                let programmaticMove = this.getNextPuzzleMove();
                this.cgApi.move(programmaticMove.from as cgTypes.Key, programmaticMove.to as cgTypes.Key);
                this.engine.move(programmaticMove);
                this.pieceMoved.emit({move: programmaticMove, moveType: MoveType.NormalProgrammatic});
                this.updateBoardUiInfo(this.cgApi, this.engine.fen(), this.engine.turn() == 'w' ? 'white' : 'black');
                }, 500);
                break;
            case PuzzleSolutionStateType.IncorrectMove:
                this.puzzleSolutionStateChanged.emit({stateType: PuzzleSolutionStateType.IncorrectMove, move: move});
                this.disableBoardUserMoves(this.cgApi);
                setTimeout(() => {
                // undo move
                let undoMove = this.engine.undo();
                this.pieceMoved.emit({move: undoMove, moveType: MoveType.Undo});
                this.updateBoardUiInfo(this.cgApi, this.engine.fen(), this.engine.turn() == 'w' ? 'white' : 'black');
                }, 1000);
                break;
        }
    }

    convertMove(orig: cgTypes.Key, dest: cgTypes.Key): ChessJS.Move {
        return (this.engine.moves({verbose:true}) as ChessJS.Move[]).find(m => m.from == orig && m.to == dest);
    }

    private isCorrectPuzzleMove(puzzle: ChessPuzzle, engine: ChessInstance): boolean {
      const movesMadeCount = engine.history().length;
  
      return movesMadeCount == 0
        ? false
        : this.arraysEqual(puzzle.solutionMovements.slice(0, movesMadeCount).map(m => m.san), engine.history());
    }
  
    private arraysEqual(arr1: Array<any>, arr2: Array<any>): boolean {
      return arr1.length == arr2.length && !arr1.some((val, idx) => arr2[idx] !== val);
    }

    private getNextPuzzleMove(): ChessJS.Move {
      const movesMadeCount = this.engine.history().length;
      return this.puzzleInfo.solutionMovements[movesMadeCount];
    }
}
