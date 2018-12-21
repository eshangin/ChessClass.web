import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class MoveClickInfo {
  moveIndex: number;
  moves: string[];
}

@Component({
  selector: 'app-chess-move-list',
  templateUrl: './chess-move-list.component.html',
  styleUrls: ['./chess-move-list.component.scss']
})
export class ChessMoveListComponent implements OnInit {

  @Input() moves: string[];
  @Input() blackIsFirst: boolean;
  @Input() movesClickable: boolean = false;
  @Output() moveClick = new EventEmitter<MoveClickInfo>();
  Math = Math;

  constructor() { }

  ngOnInit() {
  }

  onMoveClick(moveIndex: number) {
    this.moveClick.emit({moveIndex: moveIndex, moves:this.moves})
  }

  isBlackMove(index: number) {
    return !this.blackIsFirst && index % 2 == 1 || 
      this.blackIsFirst && index % 2 == 0;
  }

}
