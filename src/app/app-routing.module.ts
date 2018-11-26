import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchoolClassComponent} from './school-class/school-class.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ExperimentsComponent} from './experiments/experiments.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my/classes/:id', component: SchoolClassComponent },
  { path: 'experiments', component: ExperimentsComponent },  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
