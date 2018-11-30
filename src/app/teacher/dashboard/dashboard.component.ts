import { Component, OnInit } from '@angular/core';
import {SchoolClass} from 'src/app/services/school-class.model';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateClassModalComponent} from '../create-class-modal/create-class-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  myClasses: SchoolClass[] = [];

  constructor(
    private classService: SchoolClassService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.classService.getClasses().subscribe(classes => this.myClasses = classes);
  }

  onCreateClassClick() {
    const modalRef = this.modalService.open(CreateClassModalComponent, {ariaLabelledBy: 'modal-basic-title'});
    modalRef.result.then((result) => {      
    }, () => {});    
  }

  get gropedClasses() {
    const groupBy = 3;
    return this.myClasses.reduce((p, c) => {
      if (p[p.length - 1].length == groupBy) {
        p.push([]);
      }
      let lastArr = p[p.length - 1];
      lastArr.push(c);
      return p;
    }, [[]]);
  }
}
