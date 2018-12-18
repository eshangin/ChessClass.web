import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { dragNewPiece } from 'chessground/drag';
import { MouchEvent, Color, Role } from 'chessground/types';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';

@Component({
  selector: 'app-simple-board',
  templateUrl: './simple-board.component.html',
  styleUrls: ['./simple-board.component.scss']
})
export class SimpleBoardComponent implements OnInit {

  private cg: Api;
  cgConfig: Config;
  pieceSize: string;
  pieces: Role[] = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cgConfig = {
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
      },
      resizable: true
    };
  }

  onCgInitialized(cgApi: Api) {
    this.cg = cgApi;
    this.pieceSize = (cgApi.state.dom.bounds().width / 8).toString();
    this.cdRef.detectChanges();
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
