import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupilRoutingModule } from './pupil-routing.module';
import {PupilAreaComponent} from './pupil-area/pupil-area.component';
import { PupilHomeComponent } from './pupil-home/pupil-home.component';
import {SharedModule} from '../shared/shared.module';
import { DoHomeworkComponent } from './do-homework/do-homework.component';

@NgModule({
  declarations: [PupilAreaComponent, PupilHomeComponent, DoHomeworkComponent],
  imports: [
    CommonModule,
    PupilRoutingModule,
    SharedModule
  ]
})
export class PupilModule { }
