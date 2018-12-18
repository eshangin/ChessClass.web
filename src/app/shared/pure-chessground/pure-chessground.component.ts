import { Component, AfterViewInit, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Chessground } from 'chessground';
import { Config } from 'chessground/config';
import { Api } from 'chessground/api';

@Component({
  selector: 'app-pure-chessground',
  templateUrl: './pure-chessground.component.html',
  styleUrls: ['./pure-chessground.component.scss']
})
export class PureChessgroundComponent implements AfterViewInit {

  @Input() config: Config;
  @Output() private initialized = new EventEmitter<Api>();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.children[0].children[0];
    let cg = Chessground(container, this.config);
    this.initialized.emit(cg);
  }

}
