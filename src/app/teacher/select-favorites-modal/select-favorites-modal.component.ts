import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-favorites-modal',
  templateUrl: './select-favorites-modal.component.html',
  styleUrls: ['./select-favorites-modal.component.scss']
})
export class SelectFavoritesModalComponent implements OnInit {

  @Input() modalTitle: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
