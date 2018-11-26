import { Component, OnInit } from '@angular/core';
import {SchoolClass, SchoolClassService} from '../school-class.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  myClasses: SchoolClass[] = [];

  constructor(private classService: SchoolClassService) { }

  ngOnInit() {
    this.classService.getClasses().subscribe(classes => this.myClasses = classes);
  }

}
