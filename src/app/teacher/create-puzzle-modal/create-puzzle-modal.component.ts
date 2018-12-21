import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreatePuzzleResult, CreatePuzzleWizardComponent } from '../create-puzzle-wizard/create-puzzle-wizard.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormHelperService } from 'src/app/services/form-helper.service';

@Component({
  selector: 'app-create-puzzle-modal',
  templateUrl: './create-puzzle-modal.component.html',
  styleUrls: ['./create-puzzle-modal.component.scss']
})
export class CreatePuzzleModalComponent implements OnInit {

  wizardStep: number = 1;
  form: FormGroup;
  @ViewChild(CreatePuzzleWizardComponent) wizard: CreatePuzzleWizardComponent;

  constructor(
    public activeModal: NgbActiveModal,
    private formHelperService: FormHelperService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({});
  }

  goToNextStep() {
    if (this.form.valid) {      
      this.wizardStep++;
    } else {
      this.formHelperService.validateAllFormFields(this.form);
    }
  }

  onPuzzleCreated(data: ICreatePuzzleResult) {
    // TODO :: remove this hack. The problem is that we get error without this
    setTimeout(() => {
      this.activeModal.close(data);
    }, 0);    
  }

}
