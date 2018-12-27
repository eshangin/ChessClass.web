import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HomeworkService} from 'src/app/services/homework.service';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {SchoolClass} from 'src/app/services/school-class.model';
import {Homework} from 'src/app/services/homework.model';
import { forkJoin } from 'rxjs';
import { ChessHelperService } from 'src/app/services/chess-helper.service';
import { MoveClickInfo } from 'src/app/shared/chess-move-list/chess-move-list.component';
import { Config } from 'chessground/config';
import * as _ from 'underscore'
import * as Chess from 'chess.js';
import { PuzzleType } from 'src/app/services/puzzle.model';
import { Api } from 'chessground/api';
import * as cgTypes from 'chessground/types';

class HomeworkViewModel {
  id: string;
  dateCreated: Date;
  puzzles: PuzzleViewModel[];
}

class PuzzleViewModel {
  id: string;
  initialFen: string;
  pgn: string;
  description: string;
  fixedPercent: number;
  standardPuzzleSolution?: {
    moves: string[];
    blackIsFirst: boolean;
  };
  findAllChecksPuzzleSolution: {
    totalChecks: number;
  };
  cgConfig: Config;
  cgApi: Api;
}

@Component({
  selector: 'app-school-class',
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {

  class: SchoolClass;
  homeworks: HomeworkViewModel[];
  private revertPositoinTimeouts = new Map<string, any>();

  constructor(
    private route: ActivatedRoute,
    private homeworkService: HomeworkService,
    private chessHelperService: ChessHelperService,
    private classService: SchoolClassService) { }

  ngOnInit() {
    const classId = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.classService.getClass(classId),
      this.homeworkService.getClassHomeworks(classId)
    ]).subscribe(results => {
      this.class = results[0];
      const pupilsCount = this.class.pupils.length;
      this.homeworks = (results[1] as Homework[]).map(h => {
        return {
          id: h.id,
          dateCreated: h.dateCreated,
          puzzles: h.puzzles.map(p => {
            let model = {
              id: p.id,
              pgn: p.pgn,
              description: p.description,
              fixedPercent: Math.ceil(h.pupilStats.filter(ps => ps.fixedPuzzleIds.indexOf(p.id) != -1).length / pupilsCount * 100)
            } as PuzzleViewModel;
            let fen = '';
            switch (p.puzzleType) {
              case PuzzleType.Standard:
                let cp = this.chessHelperService.parsePuzzle(p.pgn);
                fen = cp.initialFen;
                model.standardPuzzleSolution = {
                  moves: cp.solutionMovements.map(m => m.san),
                  blackIsFirst: cp.turn == 'b'
                };
                break;
              case PuzzleType.FindAllChecks:
                fen = p.fen;
                model.findAllChecksPuzzleSolution = {
                  totalChecks: this.chessHelperService.findAllChecks(p.fen).length
                }
                break;
            }
            model.initialFen = fen;
            model.cgConfig = {fen: fen, viewOnly: true, coordinates: false, lastMove: null, check: false};
            return model;
          })
        } as HomeworkViewModel;
      });
    });
  }

  onBoardInit(cgApi: Api, puzzleView: PuzzleViewModel) {
    puzzleView.cgApi = cgApi;
  }

  onMoveClick(moveInfo: MoveClickInfo, puzzle: PuzzleViewModel) {
    let engine = new Chess(puzzle.initialFen);
    for (let i = 0; i <= moveInfo.moveIndex; i++) {
      engine.move(moveInfo.moves[i]);
    }
    puzzle.cgApi.set({fen: engine.fen(), turnColor: engine.turn() == 'w' ? 'white' : 'black'});
    puzzle.cgApi.set({check: this.chessHelperService.isCgInCheck(puzzle.cgApi)});
    this.schedulePuzzleReset(puzzle);
  }

  private schedulePuzzleReset(puzzle: PuzzleViewModel) {
    let prevTimer = this.revertPositoinTimeouts.get(puzzle.id);
    if (prevTimer) {
      clearTimeout(prevTimer);
    }
    this.revertPositoinTimeouts.set(puzzle.id, 
      setTimeout(() => {
        this.revertPositoinTimeouts.delete(puzzle.id);
        puzzle.cgApi.set(puzzle.cgConfig);
      }, 2000)
    );
  }

}
