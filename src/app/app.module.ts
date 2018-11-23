import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { GameControlsComponent } from './game-controls/game-controls.component';
import { ChessPuzzleComponent } from './chess-puzzle/chess-puzzle.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
