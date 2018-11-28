import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Pupil} from 'src/app/services/pupil.model';
import {PupilService} from 'src/app/services/pupil.service';

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
    this.pupilService.getPupil(id).subscribe(p => {this.pupil = p; console.log(p)});
  }
}
