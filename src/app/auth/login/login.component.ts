import { Component, OnInit }   from '@angular/core';
import { Router }      from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
      public authService: AuthService, 
      public router: Router,
      private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      emailField: new FormControl('', Validators.required),
      passwordField: new FormControl('', Validators.required)
    });
  }

  login() {
    if (this.form.valid) {
      this.authService.login().subscribe(() => {
        if (this.authService.isLoggedIn) {
          // Get the redirect URL from our auth service
          // If no redirect has been set, use the default
          let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/my';

          // Redirect the user
          this.router.navigate([redirect]);
        }
      });
    }
  }

  get emailField() { return this.form.get('emailField'); }
  get passwordField() { return this.form.get('passwordField'); }
}