import { Component, OnInit } from '@angular/core';
import {HomeworkService} from 'src/app/services/homework.service';
import {AuthService} from 'src/app/services/auth.service';
import {Homework} from 'src/app/services/homework.model';

@Component({
  selector: 'app-pupil-home',
  templateUrl: './pupil-home.component.html',
  styleUrls: ['./pupil-home.component.scss']
})
export class PupilHomeComponent implements OnInit {

  homeworks: Homework[] = [];

  constructor(
    private authService: AuthService,
    private homeworkService: HomeworkService) { }

  ngOnInit() {    
    this.homeworkService.getHomeworks(this.authService.currentUser.id).subscribe(homeworks => this.homeworks = homeworks);
    setTimeout(() => {
      console.log(this.homeworks);
    }, 1000);
  }

}
