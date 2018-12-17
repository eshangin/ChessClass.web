import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChessBoardComponent} from './chess-board/chess-board.component';
import {GameControlsComponent} from './game-controls/game-controls.component';
import {ChessPuzzleComponent} from './chess-puzzle/chess-puzzle.component';
import { HomeworkPuzzleChatComponent } from './homework-puzzle-chat/homework-puzzle-chat.component';
import { FormsModule } from '@angular/forms';
import { ChessMoveComponent } from './chess-move/chess-move.component';
import { ChessMoveListComponent } from './chess-move-list/chess-move-list.component';
import { CreatePuzzleComponent } from './create-puzzle/create-puzzle.component';
import { SimpleBoardComponent } from './simple-board/simple-board.component';

@NgModule({
  declarations: [    
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent,
    HomeworkPuzzleChatComponent,
    ChessMoveComponent,
    ChessMoveListComponent,
    CreatePuzzleComponent,
    SimpleBoardComponent,
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
    ChessMoveComponent,
    SimpleBoardComponent,
    ChessMoveListComponent,
    CreatePuzzleComponent
  ],
  schemas: [ 
    // TODO :: we use this just because of <piece> tag and custom chessground pieces. Maybe create angular component like app-cg-piece!?
    NO_ERRORS_SCHEMA 
  ]
})
export class SharedModule { }
