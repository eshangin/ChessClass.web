import { Component, OnInit } from '@angular/core';
import {PupilService} from '../services/pupil.service';
import {ActivatedRoute} from '@angular/router';
import {Pupil} from '../services/pupil.model';

@Component({
  selector: 'app-teacher-pupil',
  templateUrl: './teacher-pupil.component.html',
  styleUrls: ['./teacher-pupil.component.scss']
})
export class TeacherPupilComponent implements OnInit {

  pupil: Pupil;

  constructor(
    private route: ActivatedRoute,
    private pupilService: PupilService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pupilService.getPupil(id).subscribe(p => this.pupil = p);
  }

}
