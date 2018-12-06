import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PupilService } from 'src/app/services/pupil.service';
import { ActivatedRoute } from '@angular/router';
import { Pupil } from 'src/app/services/pupil.model';

@Component({
  selector: 'app-print-codes',
  templateUrl: './print-codes.component.html',
  styleUrls: ['./print-codes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintCodesComponent implements OnInit {

  pupils: Pupil[] = [];

  constructor(
    private route: ActivatedRoute,
    private pupilService: PupilService
  ) { }

  ngOnInit() {
    const classId = this.route.snapshot.queryParamMap.get('classId');
    if (classId) {
      this.pupilService.getPupils(classId).subscribe(pupils => {         
        this.pupils.push(...pupils);
        this.print();
      });
    } else {
      const pupilId = this.route.snapshot.queryParamMap.get('pupilId');
      if (pupilId) {
        this.pupilService.getPupil(pupilId).subscribe(pupil => {
          this.pupils.push(pupil);
          this.print();
        });
      }
    }
  }

  private print() {
    window.print();
  }
}
