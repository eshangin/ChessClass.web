import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Pupil} from 'src/app/services/pupil.model';
import {PupilService} from 'src/app/services/pupil.service';
import {HomeworkService} from 'src/app/services/homework.service';
import {Homework} from 'src/app/services/homework.model';

@Component({
  selector: 'app-teacher-pupil',
  templateUrl: './teacher-pupil.component.html',
  styleUrls: ['./teacher-pupil.component.scss']
})
export class TeacherPupilComponent implements OnInit {

  pupil: Pupil;
  homeworks: Homework[];

  constructor(
    private route: ActivatedRoute,
    private pupilService: PupilService,
    private homeworkService: HomeworkService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pupilService.getPupil(id).subscribe(p => this.pupil = p);
    this.homeworkService.getHomeworks(id).subscribe(h => {this.homeworks = h; console.log(h)});
  }
}
