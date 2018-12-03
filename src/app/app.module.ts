import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SelectFavoritesModalComponent } from './teacher/select-favorites-modal/select-favorites-modal.component';
import { CreateClassModalComponent } from './teacher/create-class-modal/create-class-modal.component';
import { AddPupilToClassModalComponent } from './teacher/add-pupil-to-class-modal/add-pupil-to-class-modal.component';
import { StartPageComponent } from './home/start-page/start-page.component';
import { TeacherAreaComponent } from './teacher/teacher-area/teacher-area.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';

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
    SearchPuzzlesComponent,
    SelectFavoritesModalComponent,
    CreateClassModalComponent,
    AddPupilToClassModalComponent,
    StartPageComponent,
    TeacherAreaComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000
    }),
    NgbModule
  ],
  entryComponents: [
    SelectFavoritesModalComponent,
    CreateClassModalComponent,
    AddPupilToClassModalComponent
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
