import { Component, AfterViewInit, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Chessground } from 'chessground';
import { Config } from 'chessground/config';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-pure-chessground',
  templateUrl: './pure-chessground.component.html',
  styleUrls: ['./pure-chessground.component.scss']
})
export class PureChessgroundComponent implements AfterViewInit, OnChanges, AfterViewChecked {

  @Input() sizePx: number;
  @Input() config: Config;
  @Output() private initialized = new EventEmitter<Api>();
  private cg: Api;
  private isInitialized = false;
  private needRedrawCg = false;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.children[0].children[0];
    this.cg = Chessground(container, this.config);
    this.initialized.emit(this.cg);
    this.isInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInitialized && changes.sizePx) {
      this.needRedrawCg = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.needRedrawCg) {
      this.cg.redrawAll();
      this.needRedrawCg = false;
    }
  }

}
