import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

import { Chessground } from 'chessground';
import { dragNewPiece } from 'chessground/drag';
import { MouchEvent, Color, Role } from 'chessground/types';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-simple-board',
  templateUrl: './simple-board.component.html',
  styleUrls: ['./simple-board.component.scss']
})
export class SimpleBoardComponent implements OnInit, AfterViewInit {

  private cg: Api;
  pieces: Role[] = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.children[0].children[0];
    this.cg = Chessground(container, {
      //fen: '2r3k1/pp2Qpbp/4b1p1/3p4/3n1PP1/2N4P/Pq6/R2K1B1R w -',
      //viewOnly: true
      movable: {
        free: true,
        color: 'both'
      },
      premovable: {
        enabled: false
      },
      drawable: {
        enabled: true
      },
      draggable: {
        showGhost: true,
        distance: 0,
        autoDistance: false,
        deleteOnDropOff: true
      },
      highlight: {
        lastMove: false
      }
    });
  }
  
  pieceMouseDown(e: MouchEvent, color: Color, piece: Role) {

    e.preventDefault();
    // if (e.type === 'touchstart') {
    //   e.preventDefault();
    // }

    dragNewPiece(this.cg.state, { color: color, role: piece, promoted: false }, e, true);
  }

  pieceMouseUp() {
    console.log('up');
  }

}
