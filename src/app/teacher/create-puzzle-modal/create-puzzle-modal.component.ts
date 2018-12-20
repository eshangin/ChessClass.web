import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICreatePuzzleResult } from '../create-puzzle-wizard/create-puzzle-wizard.component';

@Component({
  selector: 'app-create-puzzle-modal',
  templateUrl: './create-puzzle-modal.component.html',
  styleUrls: ['./create-puzzle-modal.component.scss']
})
export class CreatePuzzleModalComponent implements OnInit {

  wizardStep: number = 1;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  goToNextStep() {
    this.wizardStep++;
  }

  onPuzzleCreated(data: ICreatePuzzleResult) {
    this.activeModal.close({ data: data });
  }

}
