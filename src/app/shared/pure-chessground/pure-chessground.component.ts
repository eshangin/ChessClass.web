import { Component, AfterViewInit, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Chessground } from 'chessground';
import { Config } from 'chessground/config';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-pure-chessground',
  templateUrl: './pure-chessground.component.html',
  styleUrls: ['./pure-chessground.component.scss']
})
export class PureChessgroundComponent implements AfterViewInit, OnChanges, AfterViewChecked {

  @Input() sizePx: number = null;
  @Input() config: Config;
  @Output() private initialized = new EventEmitter<Api>();
  private cg: Api;
  private isInitialized = false;
  private needRedrawCg = false;

  constructor(
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    let parentEl = this.elementRef.nativeElement.parentElement;
    if (!this.sizePx) {
      this.sizePx = parentEl.clientWidth;
      this.cdRef.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInitialized && changes.sizePx) {
      this.needRedrawCg = true;
    }
  }

  ngAfterViewChecked(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
      const container = this.elementRef.nativeElement.children[0].children[0];
      this.cg = Chessground(container, this.config);
      this.initialized.emit(this.cg);
    }
    if (this.needRedrawCg) {
      this.cg.redrawAll();
      this.needRedrawCg = false;
    }
  }

}
