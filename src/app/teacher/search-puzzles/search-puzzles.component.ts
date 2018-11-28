import { Component, OnInit } from '@angular/core';
import {PuzzleService} from 'src/app/services/puzzle.service';
import {Puzzle} from 'src/app/services/puzzle.model';

@Component({
  selector: 'app-search-puzzles',
  templateUrl: './search-puzzles.component.html',
  styleUrls: ['./search-puzzles.component.scss']
})
export class SearchPuzzlesComponent implements OnInit {

  searchItems: Puzzle[] = [];

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit() {
    this.puzzleService.getPuzzles().subscribe(puzzles => this.searchItems = puzzles);
  }

  onAddToFavoriteClick(puzzle: Puzzle) {
    puzzle.isFavorite = !puzzle.isFavorite;
    if (puzzle.isFavorite) {
      this.puzzleService.addToFavorites(puzzle.id).subscribe();
    }
  }
}
