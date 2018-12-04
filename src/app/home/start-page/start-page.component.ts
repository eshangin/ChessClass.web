import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    public router: Router) { }

  ngOnInit() {
  }

  submitCode() {
    this.authService.pupilLogin('').subscribe(() => {
      if (this.authService.isLoggedIn) {
        this.router.navigate(['/p']);
      }      
    });
  }

}
