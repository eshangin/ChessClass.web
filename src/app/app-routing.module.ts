import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchoolClassComponent} from './school-class/school-class.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ExperimentsComponent} from './experiments/experiments.component';
import {TeacherPupilComponent} from './teacher-pupil/teacher-pupil.component';
import {AddHomeworkComponent} from './teacher/add-homework/add-homework.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my/classes/:id', component: SchoolClassComponent },
  { path: 'experiments', component: ExperimentsComponent },
  { path: 'my/pupils/:id', component: TeacherPupilComponent },
  { path: 'my/class/:id/add-homework', component: AddHomeworkComponent },  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
