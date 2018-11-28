import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchoolClassComponent} from './teacher/school-class/school-class.component';
import {DashboardComponent} from './teacher/dashboard/dashboard.component';
import {ExperimentsComponent} from './experiments/experiments.component';
import {TeacherPupilComponent} from './teacher/teacher-pupil/teacher-pupil.component';
import {AddHomeworkComponent} from './teacher/add-homework/add-homework.component';
import {SearchPuzzlesComponent} from './teacher/search-puzzles/search-puzzles.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'my/classes/:id', component: SchoolClassComponent },
  { path: 'experiments', component: ExperimentsComponent },
  { path: 'my/pupils/:id', component: TeacherPupilComponent },
  { path: 'my/class/:id/add-homework', component: AddHomeworkComponent },
  { path: 'puzzles', component: SearchPuzzlesComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
