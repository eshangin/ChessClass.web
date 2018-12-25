import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PupilAreaComponent} from './pupil-area/pupil-area.component';
import {PupilHomeComponent} from './pupil-home/pupil-home.component';
import {DoHomeworkComponent} from './do-homework/do-homework.component';

const routes: Routes = [
  { 
    path: '', 
    component: PupilAreaComponent,
    children: [
      { path: '', component: PupilHomeComponent },      
      { path: 'do-homeworks', component: DoHomeworkComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupilRoutingModule { }
