import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchoolClassComponent} from './teacher/school-class/school-class.component';
import {DashboardComponent} from './teacher/dashboard/dashboard.component';
import {ExperimentsComponent} from './experiments/experiments.component';
import {TeacherPupilComponent} from './teacher/teacher-pupil/teacher-pupil.component';
import {AddHomeworkComponent} from './teacher/add-homework/add-homework.component';
import {SearchPuzzlesComponent} from './teacher/search-puzzles/search-puzzles.component';
import {StartPageComponent} from './home/start-page/start-page.component';
import {TeacherAreaComponent} from './teacher/teacher-area/teacher-area.component';
import {AuthGuard} from './auth/auth.guard';
import {LoginComponent} from './auth/login/login.component';
import {LogoutComponent} from './auth/logout/logout.component';

const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'experiments', component: ExperimentsComponent },
  { path: 'puzzles', component: SearchPuzzlesComponent },
  {
    path: 'my',
    component: TeacherAreaComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'classes', pathMatch: 'full' },
      { path: 'classes', component: DashboardComponent },
      { path: 'classes/:id', component: SchoolClassComponent },
      { path: 'pupils/:id', component: TeacherPupilComponent },
      { path: 'class/:id/add-homework', component: AddHomeworkComponent },
    ]
  },
  { path: 'p', loadChildren: './pupil/pupil.module#PupilModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
