import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { GameControlsComponent } from './game-controls/game-controls.component';
import { ChessPuzzleComponent } from './chess-puzzle/chess-puzzle.component';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './services/in-memory-data.service';
import { SchoolClassComponent } from './teacher/school-class/school-class.component';
import { DashboardComponent } from './teacher/dashboard/dashboard.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { TeacherPupilComponent } from './teacher/teacher-pupil/teacher-pupil.component';
import { AddHomeworkComponent } from './teacher/add-homework/add-homework.component';
import { SearchPuzzlesComponent } from './teacher/search-puzzles/search-puzzles.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    GameControlsComponent,
    ChessPuzzleComponent,
    SchoolClassComponent,
    DashboardComponent,
    ExperimentsComponent,
    TeacherPupilComponent,
    AddHomeworkComponent,
    SearchPuzzlesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
