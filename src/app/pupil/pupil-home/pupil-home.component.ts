import { Component, OnInit } from '@angular/core';
import {HomeworkService} from 'src/app/services/homework.service';
import {AuthService} from 'src/app/services/auth.service';
import { Homework } from 'src/app/services/homework.model';

@Component({
  selector: 'app-pupil-home',
  templateUrl: './pupil-home.component.html',
  styleUrls: ['./pupil-home.component.scss']
})
export class PupilHomeComponent implements OnInit {

  pupilId: string;
  homeworks: Homework[];
  nonFixedPuzzlesCount: number = 0;
  homeworksCount: number = 0;

  constructor(
    private authService: AuthService,
    private homeworkService: HomeworkService) { }

  ngOnInit() {
    this.pupilId = this.authService.currentUser.id;
    this.homeworkService.getHomeworks(this.authService.currentUser.id).subscribe(homeworks => {
      homeworks.forEach(h => this.nonFixedPuzzlesCount += h.puzzles.length - h.pupilStats[0].fixedPuzzlesCount);
      this.homeworksCount = homeworks.length;
      this.homeworks = homeworks;
    });
  }

}
