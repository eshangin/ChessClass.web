import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PupilAreaComponent} from './pupil-area/pupil-area.component';

const routes: Routes = [
  { path: '', component: PupilAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupilRoutingModule { }
