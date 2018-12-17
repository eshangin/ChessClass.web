import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

import { Chessground } from 'chessground';

@Component({
  selector: 'app-simple-board',
  templateUrl: './simple-board.component.html',
  styleUrls: ['./simple-board.component.scss']
})
export class SimpleBoardComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.children[0].children[0];
    let cg = Chessground(container, {
      //fen: '2r3k1/pp2Qpbp/4b1p1/3p4/3n1PP1/2N4P/Pq6/R2K1B1R w -',
      //viewOnly: true
      movable: {
        free: true
      },
      draggable: {
        enabled: true
      },
    });
  }  

}
