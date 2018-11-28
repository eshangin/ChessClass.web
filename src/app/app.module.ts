import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { GameControlsComponent } from './game-controls/game-controls.component';
import { ChessPuzzleComponent } from './chess-puzzle/chess-puzzle.component';
import { SchoolClassComponent } from './teacher/school-class/school-class.component';
import { DashboardComponent } from './teacher/dashboard/dashboard.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { TeacherPupilComponent } from './teacher/teacher-pupil/teacher-pupil.component';
import { AddHomeworkComponent } from './teacher/add-homework/add-homework.component';
import { SearchPuzzlesComponent } from './teacher/search-puzzles/search-puzzles.component';
import {AddHeadersInterceptor} from './core/add-headers.interceptor';
import {FakeBackendInterceptor} from './core/fake-backend.interceptor';
import localeRu from '@angular/common/locales/ru';
import {registerLocaleData} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

registerLocaleData(localeRu);

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
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddHeadersInterceptor, multi: true, },
    // provider used to create fake backend
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true, },
    { provide: LOCALE_ID, useValue: 'ru'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
