import { Component, OnInit } from '@angular/core';
import {PupilService, Pupil} from '../services/pupil.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-school-class',
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {

  pupils: Pupil[] = [];

  constructor(
    private route: ActivatedRoute,
    private pupilService: PupilService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pupilService.getPupils(id).subscribe(pupils => {this.pupils = pupils; console.log(pupils)});
  }

}
