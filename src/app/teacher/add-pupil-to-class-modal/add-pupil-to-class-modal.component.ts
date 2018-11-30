import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PupilService} from 'src/app/services/pupil.service';

@Component({
  selector: 'app-add-pupil-to-class-modal',
  templateUrl: './add-pupil-to-class-modal.component.html',
  styleUrls: ['./add-pupil-to-class-modal.component.scss']
})
export class AddPupilToClassModalComponent implements OnInit {

  className: string;
  classId: string;
  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private pupilService: PupilService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.pupilService.createPupil(this.classId, this.firstName.value, this.lastName.value).subscribe(p => this.activeModal.close({ pupil: p }));
    }
  }

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
}
