import { Component, OnInit } from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    public router: Router) { }

  ngOnInit() {
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
  }

}
