import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-class-modal',
  templateUrl: './create-class-modal.component.html',
  styleUrls: ['./create-class-modal.component.scss']
})
export class CreateClassModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private classService: SchoolClassService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.classService.createClass(this.name.value).subscribe(c => this.activeModal.close({ class: c }));
    }
  }

  get name() { return this.form.get('name'); }
}
