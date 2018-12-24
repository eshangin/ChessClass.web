import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import {TeacherAreaComponent} from './teacher-area/teacher-area.component';
import {SchoolClassComponent} from './school-class/school-class.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateClassModalComponent} from './create-class-modal/create-class-modal.component';
import {AddPupilToClassModalComponent} from './add-pupil-to-class-modal/add-pupil-to-class-modal.component';
import {TeacherPupilComponent} from './teacher-pupil/teacher-pupil.component';
import {AddHomeworkComponent} from './add-homework/add-homework.component';
import {SearchPuzzlesComponent} from './search-puzzles/search-puzzles.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PrintCodesComponent } from './print-codes/print-codes.component';
import { PuzzleStatComponent } from './puzzle-stat/puzzle-stat.component';
import { CreatePuzzleModalComponent } from './create-puzzle-modal/create-puzzle-modal.component';
import { CreatePuzzleWizardComponent } from './create-puzzle-wizard/create-puzzle-wizard.component';
import { SearchPuzzlesModalComponent } from './search-puzzles-modal/search-puzzles-modal.component';

@NgModule({
  declarations: [
    SearchPuzzlesModalComponent,
    CreateClassModalComponent,
    AddPupilToClassModalComponent,
    SchoolClassComponent,
    DashboardComponent,
    TeacherAreaComponent,
    TeacherPupilComponent,
    AddHomeworkComponent,
    SearchPuzzlesComponent,
    PrintCodesComponent,
    PuzzleStatComponent,
    CreatePuzzleModalComponent,
    CreatePuzzleWizardComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule
  ],
  entryComponents: [
    SearchPuzzlesModalComponent,
    CreateClassModalComponent,
    AddPupilToClassModalComponent,
    CreatePuzzleModalComponent
  ]
})
export class TeacherModule { }
