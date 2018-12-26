import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeworkService } from 'src/app/services/homework.service';
import { Puzzle, PuzzleType } from 'src/app/services/puzzle.model';
import { ChessHelperService } from 'src/app/services/chess-helper.service';

interface ISelectablePuzzle {
  puzzle: Puzzle;
  fen: string;
}

@Component({
  selector: 'app-select-non-fixed-puzzle-modal',
  templateUrl: './select-non-fixed-puzzle-modal.component.html',
  styleUrls: ['./select-non-fixed-puzzle-modal.component.scss']
})
export class SelectNonFixedPuzzleModalComponent implements OnInit {

  @Input() exceptPuzzle: Puzzle;
  puzzles: ISelectablePuzzle[];
  PuzzleType = PuzzleType;

  constructor(
    private activeModal: NgbActiveModal,
    private homeworkService: HomeworkService,
    private chessHelperService: ChessHelperService) { }

  ngOnInit() {
    this.homeworkService.getNonFixedPuzzles().subscribe(puzzles => {
      this.puzzles = puzzles.filter(p => p.id != this.exceptPuzzle.id).map(p => {
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
    });
  }

  onChoosePuzzleClick(puzzle: Puzzle) {
    this.activeModal.close({ selectedPuzzle: puzzle });    
  }

  onDismissClick() {
    this.activeModal.dismiss();
  }

}
