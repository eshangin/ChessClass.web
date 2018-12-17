import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

import { Chessground } from 'chessground';
import { dragNewPiece } from 'chessground/drag';
import { MouchEvent } from 'chessground/types';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-simple-board',
  templateUrl: './simple-board.component.html',
  styleUrls: ['./simple-board.component.scss']
})
export class SimpleBoardComponent implements OnInit, AfterViewInit {

  private cg: Api;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.children[0].children[0];
    this.cg = Chessground(container, {
      //fen: '2r3k1/pp2Qpbp/4b1p1/3p4/3n1PP1/2N4P/Pq6/R2K1B1R w -',
      //viewOnly: true
      movable: {
        free: true
      },
      draggable: {
        enabled: true
      },
    });

    //dragNewPiece(cg.state, { color: 'white', role: 'bishop', promoted: false }, new MouchEvent(), true);
  }
  
  pieceMouseDown(event: MouchEvent) {
    console.log(event)
    dragNewPiece(this.cg.state, { color: 'white', role: 'bishop', promoted: false }, event, true);
  }

}
