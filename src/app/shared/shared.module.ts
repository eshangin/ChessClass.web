import { NgModule } from '@angular/core';
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
import { CgPieceComponent } from './cg-piece/cg-piece.component';
import { PureChessgroundComponent } from './pure-chessground/pure-chessground.component';

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
    CgPieceComponent,
    PureChessgroundComponent,
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
  ]
})
export class SharedModule { }
