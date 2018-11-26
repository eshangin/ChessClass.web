import { Component, OnInit } from '@angular/core';
import {ChessBoardComponent} from './chess-board/chess-board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }  

  ngOnInit(): void {  
  }
}
