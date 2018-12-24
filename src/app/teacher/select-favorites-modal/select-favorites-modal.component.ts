import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PuzzleService} from 'src/app/services/puzzle.service';
import {Puzzle, PuzzleType} from 'src/app/services/puzzle.model';
import { ChessHelperService } from 'src/app/services/chess-helper.service';

interface ISelectablePuzzle {
  puzzle: Puzzle;
  isSelected: boolean;
  fen: string;
}

@Component({
  selector: 'app-select-favorites-modal',
  templateUrl: './select-favorites-modal.component.html',
  styleUrls: ['./select-favorites-modal.component.scss']
})
export class SelectFavoritesModalComponent implements OnInit {

  isLoading: boolean = true;
  selectablePuzzles: ISelectablePuzzle[];

  constructor(
    public activeModal: NgbActiveModal,
    private puzzleService: PuzzleService,
    private chessHelperService: ChessHelperService) { }

  ngOnInit() {
    this.puzzleService.getFavorites().subscribe(puzzles => {
      this.selectablePuzzles = puzzles.map(p => {
        let fen = '';
        switch (p.puzzleType) {
          case PuzzleType.Standard:
            let cp = this.chessHelperService.parsePuzzle(p.pgn);
            fen = cp.initialFen;
            break;
          case PuzzleType.FindAllChecks:
            fen = p.fen;
            break;
        }        
        return {
          puzzle: p,
          fen: fen
        } as ISelectablePuzzle
      });
      this.isLoading = false;
    });
  }

  get getSelectedPuzzles(): Puzzle[] {
    return this.selectablePuzzles.filter(_ => _.isSelected).map(_ => _.puzzle);
  }

}
