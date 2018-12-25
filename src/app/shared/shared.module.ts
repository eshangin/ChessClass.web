import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChessBoardComponent} from './chess-board/chess-board.component';
import {GameControlsComponent} from './game-controls/game-controls.component';
import { HomeworkPuzzleChatComponent } from './homework-puzzle-chat/homework-puzzle-chat.component';
import { FormsModule } from '@angular/forms';
import { ChessMoveComponent } from './chess-move/chess-move.component';
import { ChessMoveListComponent } from './chess-move-list/chess-move-list.component';
import { CreatePuzzleComponent } from './create-puzzle/create-puzzle.component';
import { CgPieceComponent } from './cg-piece/cg-piece.component';
import { PureChessgroundComponent } from './pure-chessground/pure-chessground.component';
import { CgBoardEditorComponent } from './cg-board-editor/cg-board-editor.component';
import { FindAllChecksPuzzleComponent } from './puzzle-viewers/find-all-checks-puzzle/find-all-checks-puzzle.component';
import { StandardPuzzleComponent } from './puzzle-viewers/standard-puzzle/standard-puzzle.component';

@NgModule({
  declarations: [    
    ChessBoardComponent,
    GameControlsComponent,
    StandardPuzzleComponent,
    HomeworkPuzzleChatComponent,
    ChessMoveComponent,
    ChessMoveListComponent,
    CreatePuzzleComponent,
    CgPieceComponent,
    PureChessgroundComponent,
    CgBoardEditorComponent,
    FindAllChecksPuzzleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ChessBoardComponent,
    GameControlsComponent,
    StandardPuzzleComponent,
    HomeworkPuzzleChatComponent,
    ChessMoveComponent,
    ChessMoveListComponent,
    CreatePuzzleComponent,
    CgBoardEditorComponent,
    PureChessgroundComponent,
    FindAllChecksPuzzleComponent
  ]
})
export class SharedModule { }
