import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-pupil-area',
  templateUrl: './pupil-area.component.html',
  styleUrls: ['./pupil-area.component.scss']
})
export class PupilAreaComponent implements OnInit {

  pupilName: string;

  constructor(
    private authService: AuthService) { }

  ngOnInit() {
    this.pupilName = this.authService.currentUser.name;
  }

}
