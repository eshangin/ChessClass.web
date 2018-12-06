import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import {TeacherAreaComponent} from './teacher-area/teacher-area.component';
import {SchoolClassComponent} from './school-class/school-class.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SelectFavoritesModalComponent} from './select-favorites-modal/select-favorites-modal.component';
import {CreateClassModalComponent} from './create-class-modal/create-class-modal.component';
import {AddPupilToClassModalComponent} from './add-pupil-to-class-modal/add-pupil-to-class-modal.component';
import {TeacherPupilComponent} from './teacher-pupil/teacher-pupil.component';
import {AddHomeworkComponent} from './add-homework/add-homework.component';
import {SearchPuzzlesComponent} from './search-puzzles/search-puzzles.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PrintCodesComponent } from './print-codes/print-codes.component';

@NgModule({
  declarations: [
    SelectFavoritesModalComponent,
    CreateClassModalComponent,
    AddPupilToClassModalComponent,
    SchoolClassComponent,
    DashboardComponent,
    TeacherAreaComponent,
    TeacherPupilComponent,
    AddHomeworkComponent,
    SearchPuzzlesComponent,
    PrintCodesComponent,
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
    SelectFavoritesModalComponent,
    CreateClassModalComponent,
    AddPupilToClassModalComponent
  ]
})
export class TeacherModule { }
