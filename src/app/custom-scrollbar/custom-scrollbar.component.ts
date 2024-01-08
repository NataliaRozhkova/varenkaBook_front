import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.less']
})
export class CustomScrollbarComponent {


  @ViewChild('scroller1') scroller: ElementRef;


  ngOnInit(): void {
    const div = this.scroller?.nativeElement as HTMLDivElement;
    if (div) {
      div.addEventListener('mouseover', e => {
        console.log('Mouse Over');
      });
      div.addEventListener('mouseout', e => {
        console.log('Mouse Out');
      });
    }

  }


}
