import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChessBoardComponent} from './chess-board/chess-board.component';
import {GameControlsComponent} from './game-controls/game-controls.component';
import {ChessPuzzleComponent} from './chess-puzzle/chess-puzzle.component';
import { HomeworkPuzzleChatComponent } from './homework-puzzle-chat/homework-puzzle-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [    
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent,
    HomeworkPuzzleChatComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent,
    HomeworkPuzzleChatComponent,
  ]
})
export class SharedModule { }
