import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HomeworkService} from 'src/app/services/homework.service';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {SchoolClass} from 'src/app/services/school-class.model';
import {Homework} from 'src/app/services/homework.model';

@Component({
  selector: 'app-school-class',
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {

  class: SchoolClass;
  homeworks: Homework[];

  constructor(
    private route: ActivatedRoute,
    private homeworkService: HomeworkService,
    private classService: SchoolClassService) { }

  ngOnInit() {
    const classId = this.route.snapshot.paramMap.get('id');
    this.classService.getClass(classId).subscribe(c => this.class = c);
    this.homeworkService.getClassHomeworks(classId).subscribe(homeworks => this.homeworks = homeworks);
  }

}
