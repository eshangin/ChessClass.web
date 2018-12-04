import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExperimentsComponent} from './experiments/experiments.component';
import {StartPageComponent} from './home/start-page/start-page.component';
import {LoginComponent} from './auth/login/login.component';
import {LogoutComponent} from './auth/logout/logout.component';

const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'experiments', component: ExperimentsComponent },
  { path: 'my', loadChildren: './teacher/teacher.module#TeacherModule' },
  { path: 'p', loadChildren: './pupil/pupil.module#PupilModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
