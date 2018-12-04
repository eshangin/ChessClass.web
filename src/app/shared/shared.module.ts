import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChessBoardComponent} from '../chess-board/chess-board.component';
import {GameControlsComponent} from '../game-controls/game-controls.component';
import {ChessPuzzleComponent} from '../chess-puzzle/chess-puzzle.component';

@NgModule({
  declarations: [    
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent,
  ]
})
export class SharedModule { }
