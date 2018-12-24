import { Component, OnInit } from '@angular/core';
import {PuzzleService} from 'src/app/services/puzzle.service';
import {Puzzle, PuzzleType} from 'src/app/services/puzzle.model';
import { ChessHelperService } from 'src/app/services/chess-helper.service';

interface PuzzleViewModel {
  puzzle: Puzzle;
  fen: string;
}

@Component({
  selector: 'app-search-puzzles',
  templateUrl: './search-puzzles.component.html',
  styleUrls: ['./search-puzzles.component.scss']
})
export class SearchPuzzlesComponent implements OnInit {

  searchItems: PuzzleViewModel[] = [];

  constructor(
    private puzzleService: PuzzleService,
    private chessHelperService: ChessHelperService) { }

  ngOnInit() {
    this.puzzleService.getPuzzles().subscribe(result => {      
      this.searchItems = result.items.map(p => {
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
        } as PuzzleViewModel
      });
    });
  }

  onAddToFavoriteClick(puzzle: Puzzle) {
    puzzle.isFavorite = !puzzle.isFavorite;
    if (puzzle.isFavorite) {
      this.puzzleService.addToFavorites(puzzle.id).subscribe();
    } else {
      this.puzzleService.removeFromFavorites(puzzle.id).subscribe();
    }
  }
}
