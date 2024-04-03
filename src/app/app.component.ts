import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'varenka_front';

  onActivate() {

    let scrollElement = document.getElementById('content')

    scrollElement?.scrollTo(0, 0)
    scrollElement?.scroll(0,0)
  }

  // @HostListener('click', ['$event.target']) scroll(){
  //
  //   let content = document.getElementById("content");
  //
  //   console.log("**********    ", content?.scrollTop);
  //   content?.scrollTo(0,0)
  //   if (content) {
  //     content.scrollTop = 0;
  //
  //   }
  // }
}
