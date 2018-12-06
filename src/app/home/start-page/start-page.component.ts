import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  pupilAccessCode: string;
  isCodeCorrect: boolean = true;
  isCodeRequestInProgress: boolean = false;

  constructor(
    private authService: AuthService, 
    public router: Router) { }

  ngOnInit() {
  }

  submitCode() {
    this.isCodeRequestInProgress = true;
    this.authService.pupilLogin(this.pupilAccessCode).subscribe(
      () => {
        if (this.authService.isLoggedIn) {
          this.isCodeCorrect = true;
          this.router.navigate(['/p']);
        } else {
          this.isCodeCorrect = false;
        }
      }, 
      err => {
        console.log(err);
      },
      () => this.isCodeRequestInProgress = false);
  }

}
