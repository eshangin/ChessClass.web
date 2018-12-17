import { Component, OnInit, Input } from '@angular/core';
import { Role, Color } from 'chessground/types';

@Component({
  selector: 'app-cg-piece',
  templateUrl: './cg-piece.component.html',
  styleUrls: ['./cg-piece.component.scss']
})
export class CgPieceComponent implements OnInit {

  @Input() color: Color;
  @Input() piece: Role;

  constructor() { }

  ngOnInit() {
  }

}
