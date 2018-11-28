import { Component, OnInit } from '@angular/core';
import {SchoolClass} from 'src/app/services/school-class.model';
import {SchoolClassService} from 'src/app/services/school-class.service';

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
