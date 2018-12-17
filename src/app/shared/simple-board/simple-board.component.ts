import { Component, OnInit, ElementRef } from '@angular/core';

import { Chessground } from 'chessground';

@Component({
  selector: 'app-simple-board',
  templateUrl: './simple-board.component.html',
  styleUrls: ['./simple-board.component.scss']
})
export class SimpleBoardComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    let ground = Chessground(this.elementRef.nativeElement.children[0].children[0], {
      fen:'2r3k1/pp2Qpbp/4b1p1/3p4/3n1PP1/2N4P/Pq6/R2K1B1R w -'
    });
  }

}
