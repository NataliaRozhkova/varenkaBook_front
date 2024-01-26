import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.less']
})
export class CustomScrollbarComponent  implements AfterViewInit, OnInit{


  @ViewChild('scroller') scroller: ElementRef<HTMLElement>;

  @Input()
  // height: string = '80vh';

  ngOnInit(): void {
    this.initScroller();

  }

  ngAfterViewInit() {
    this.initScroller();
  }

  initScroller() {
    const div = this.scroller?.nativeElement as HTMLDivElement;

    // if (div) {
    //   div.setAttribute("style", `height: ${this.height};`)
    //
    //   div.addEventListener('mouseover', e => {
    //     // console.log('Mouse Over');
    //   });
    //   div.addEventListener('mouseout', e => {
    //     // console.log('Mouse Out');
    //   });
    // }
  }


}
