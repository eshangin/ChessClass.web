import { Component, OnInit } from '@angular/core';
import {PupilService} from '../services/pupil.service';
import {ActivatedRoute} from '@angular/router';
import {Pupil} from '../services/pupil.model';

@Component({
  selector: 'app-school-class',
  templateUrl: './school-class.component.html',
  styleUrls: ['./school-class.component.scss']
})
export class SchoolClassComponent implements OnInit {

  classId: string;
  pupils: Pupil[] = [];

  constructor(
    private route: ActivatedRoute,
    private pupilService: PupilService) { }

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');
    this.pupilService.getPupils(this.classId).subscribe(pupils => this.pupils = pupils);
  }

}
