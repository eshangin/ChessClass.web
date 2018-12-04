import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupilRoutingModule } from './pupil-routing.module';
import {PupilAreaComponent} from './pupil-area/pupil-area.component';

@NgModule({
  declarations: [PupilAreaComponent],
  imports: [
    CommonModule,
    PupilRoutingModule
  ]
})
export class PupilModule { }
