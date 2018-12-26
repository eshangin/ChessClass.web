import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PuzzleService, IPuzzlesFilter} from 'src/app/services/puzzle.service';
import {Puzzle, PuzzleType} from 'src/app/services/puzzle.model';
import { ChessHelperService } from 'src/app/services/chess-helper.service';

interface ISelectablePuzzle {
  puzzle: Puzzle;
  fen: string;
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
  currentPage: number = 1;
  totalRecords: number;
  selectedPuzzles: Puzzle[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private puzzleService: PuzzleService,
    private chessHelperService: ChessHelperService) { }

  ngOnInit() {
    this.loadPuzzles(1);
  }

  onPageChange(page: number) {
    this.loadPuzzles(page);
  }

  onPuzzleSelectToggle(puzzle: Puzzle, isSelected: boolean) {
    if (isSelected) {
      this.selectedPuzzles.push(puzzle);
    } else {
      this.selectedPuzzles = this.selectedPuzzles.filter(p => p.id != puzzle.id);
    }
  }

  isSelected(puzzle: Puzzle): boolean {
    return this.selectedPuzzles.some(p => p.id == puzzle.id);
  }

  onOkClick() {
    this.activeModal.close({ puzzles: this.selectedPuzzles });
  }

  onCancelClick() {
    this.activeModal.dismiss();
  }

  private loadPuzzles(page: number) {
    let request = {
      forClassId: this.forClassId,
      count: 8,
      page: page
    } as IPuzzlesFilter;
    this.puzzleService.getPuzzles(request).subscribe(result => {
      this.totalRecords = result.totalRecords;
      this.selectablePuzzles = result.items.map(p => {
        let fen = '';
        let solution: any;
        switch (p.puzzleType) {
          case PuzzleType.Standard:
            let cp = this.chessHelperService.parsePuzzle(p.pgn);
            fen = cp.initialFen;
            solution = {
              moves: cp.solutionMovements.map(m => m.san),
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

}
