import { Component, OnInit, Input } from '@angular/core';

interface IUiMove {
  figureChar: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-chess-move',
  templateUrl: './chess-move.component.html',
  styleUrls: ['./chess-move.component.scss']
})
export class ChessMoveComponent implements OnInit {

  @Input() move: string;
  @Input() isBlack: boolean;
  uiMove: IUiMove;

  constructor() { }

  ngOnInit() {
    this.parseMove();
  }

  private parseMove(): any {
    let moveStart = this.move[0];
    let moveEnd = this.move[this.move.length - 1];
    if (['R', 'K', 'Q', 'B', 'N'].indexOf(moveStart) != -1) {
      this.uiMove = {
        figureChar: moveStart,
        start: null,
        end: this.move.slice(1)
      };
    } else if (['R', 'K', 'Q', 'B', 'N'].indexOf(moveEnd) != -1) {
      this.uiMove = {
        figureChar: moveEnd,
        start: this.move.slice(0, this.move.length - 1),
        end: null
      };
    } else {
      this.uiMove = {
        figureChar: null,
        start: this.move,
        end: null
      };
    }
  }

}
