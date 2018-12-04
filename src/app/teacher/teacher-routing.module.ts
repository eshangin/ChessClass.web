import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TeacherAreaComponent} from './teacher-area/teacher-area.component';
import {AuthGuard} from '../auth/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SchoolClassComponent} from './school-class/school-class.component';
import {TeacherPupilComponent} from './teacher-pupil/teacher-pupil.component';
import {AddHomeworkComponent} from './add-homework/add-homework.component';
import {SearchPuzzlesComponent} from './search-puzzles/search-puzzles.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherAreaComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'classes', pathMatch: 'full' },
      { path: 'classes', component: DashboardComponent },
      { path: 'classes/:id', component: SchoolClassComponent },
      { path: 'pupils/:id', component: TeacherPupilComponent },
      { path: 'class/:id/add-homework', component: AddHomeworkComponent },      
      { path: 'puzzles', component: SearchPuzzlesComponent },
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
