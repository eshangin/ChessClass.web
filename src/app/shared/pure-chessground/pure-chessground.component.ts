import { Component, AfterViewInit, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Chessground } from 'chessground';
import { Config } from 'chessground/config';
import { Api } from 'chessground/api';
import * as $ from 'jquery'

@Component({
  selector: 'app-pure-chessground',
  templateUrl: './pure-chessground.component.html',
  styleUrls: ['./pure-chessground.component.scss']
})
export class PureChessgroundComponent implements AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {

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
      if (parentEl) {
        this.sizePx = $(parentEl).width();
        this.cdRef.detectChanges();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInitialized) {
      if (changes.sizePx) {
        this.needRedrawCg = true;
      }
      if (changes.config) {
        this.cg.set(changes.config.currentValue as Config);
      }
    }
  }

  ngAfterViewChecked(): void {
    if (!this.isInitialized) {
      // TODO :: find a way how to remove setTimeout which helps to properly draw chessground      
      setTimeout(() => {
        this.isInitialized = true;
        const container = this.elementRef.nativeElement.children[0].children[0];
        this.cg = Chessground(container, this.config);
        this.initialized.emit(this.cg);          
      }, 0);
    }
    if (this.needRedrawCg) {
      this.needRedrawCg = false;
      this.cg.redrawAll();
    }
  }

  ngOnDestroy() {
    this.cdRef.detach();
  }

}
