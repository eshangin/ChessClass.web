import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { dragNewPiece } from 'chessground/drag';
import { MouchEvent, Color, Role } from 'chessground/types';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';

@Component({
  selector: 'app-cg-create-puzzle',
  templateUrl: './cg-create-puzzle.component.html',
  styleUrls: ['./cg-create-puzzle.component.scss']
})
export class CgCreatePuzzleComponent implements OnInit {

  private cg: Api;
  cgConfig: Config;
  pieceSize: string;
  pieces: Role[] = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
  @Output() editorInitialized = new EventEmitter<Api>();

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cgConfig = {
      fen: '8/8/8/8/8/8/8/8',
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
        deleteOnDropOff: true,
        centerPiece: true
      },
      selectable: {
        enabled: false
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
    this.editorInitialized.emit(cgApi);
  }
  
  pieceMouseDown(e: MouchEvent, color: Color, piece: Role) {

    e.preventDefault();
    // if (e.type === 'touchstart') {
    //   e.preventDefault();
    // }

    dragNewPiece(this.cg.state, { color: color, role: piece, promoted: false }, e, true);
  }

}
