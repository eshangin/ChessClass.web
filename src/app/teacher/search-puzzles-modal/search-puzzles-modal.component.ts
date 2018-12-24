import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PuzzleService, IPuzzlesFilter} from 'src/app/services/puzzle.service';
import {Puzzle, PuzzleType} from 'src/app/services/puzzle.model';
import { ChessHelperService } from 'src/app/services/chess-helper.service';

interface ISelectablePuzzle {
  puzzle: Puzzle;
  isSelected: boolean;
  fen: string;
  turn: 'w' | 'b';
  solution: any;
}

@Component({
  selector: 'app-search-puzzles-modal',
  templateUrl: './search-puzzles-modal.component.html',
  styleUrls: ['./search-puzzles-modal.component.scss']
})
export class SearchPuzzlesModalComponent implements OnInit {

  @Input() forClassId: string;
  isLoading: boolean = true;
  selectablePuzzles: ISelectablePuzzle[];
  PuzzleType = PuzzleType;

  constructor(
    public activeModal: NgbActiveModal,
    private puzzleService: PuzzleService,
    private chessHelperService: ChessHelperService) { }

  ngOnInit() {
    let filter = {
      forClassId: this.forClassId
    } as IPuzzlesFilter;
    this.puzzleService.getPuzzles(filter).subscribe(puzzles => {
      this.selectablePuzzles = puzzles.map(p => {
        let fen = '';
        let solution: any;
        switch (p.puzzleType) {
          case PuzzleType.Standard:
            let cp = this.chessHelperService.parsePuzzle(p.pgn);
            fen = cp.initialFen;
            solution = {
              moves: cp.solutionMovements,
              turn: cp.turn
            };
            break;
          case PuzzleType.FindAllChecks:
            fen = p.fen;
            solution = {
              allChecks: this.chessHelperService.findAllChecks(p.fen),
              turn: this.chessHelperService.getTurn(p.fen)
            };
            break;
        }        
        return {
          puzzle: p,
          fen: fen,
          solution: solution
        } as ISelectablePuzzle
      });
      this.isLoading = false;
    });
  }

  get getSelectedPuzzles(): Puzzle[] {
    return this.selectablePuzzles.filter(_ => _.isSelected).map(_ => _.puzzle);
  }

}
