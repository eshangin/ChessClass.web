import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chess-move-list',
  templateUrl: './chess-move-list.component.html',
  styleUrls: ['./chess-move-list.component.scss']
})
export class ChessMoveListComponent implements OnInit {

  @Input() moves: string[];
  @Input() blackIsFirst: boolean;
  Math = Math;

  constructor() { }

  ngOnInit() {
  }

  isBlackMove(index: number) {
    return !this.blackIsFirst && index % 2 == 1 || 
      this.blackIsFirst && index % 2 == 0;
  }

}
