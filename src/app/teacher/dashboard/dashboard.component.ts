import { Component, OnInit } from '@angular/core';
import {SchoolClass} from 'src/app/services/school-class.model';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateClassModalComponent} from '../create-class-modal/create-class-modal.component';
import {AddPupilToClassModalComponent} from '../add-pupil-to-class-modal/add-pupil-to-class-modal.component';
import {trigger, transition, animate, style} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
     trigger('anim', [
        // transition('* => void', [
        //   style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
        //   sequence([
        //     animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
        //     animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none'  }))
        //   ])
        // ]),
        transition('void => active', [
          style({ height: '0', opacity: '0' }),
          animate(".50s ease", style({ height: '*', opacity: 1 }))
        ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  gClasses: [Array<SchoolClass>] = [Array<SchoolClass>()];

  constructor(
    private classService: SchoolClassService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.classService.getClasses().subscribe(classes => {
      classes.forEach(c => this.addClassToGroup(c));
    });
  }

  onCreateClassClick() {
    const modalRef = this.modalService.open(CreateClassModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    modalRef.result.then((result) => {
      result.class.uiState = 'active';
      this.addClassToGroup(result.class);
      console.log(this.gClasses);
    }, () => {});
  }

  onAddPupilClick(c: SchoolClass) {
    const modalRef = this.modalService.open(AddPupilToClassModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    modalRef.componentInstance.classId = c.id;
    modalRef.componentInstance.className = c.name;
    modalRef.result.then((result) => {
      c.pupils.push(result.pupil);
    }, () => {});
  }

  private addClassToGroup(c: SchoolClass) {
    const groupBy = 2;
    if (this.gClasses[this.gClasses.length - 1].length == groupBy) {
      this.gClasses.push(Array<SchoolClass>());
    }
    this.gClasses[this.gClasses.length - 1].push(c);
  }
}
