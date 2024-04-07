import {Component} from '@angular/core';

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

}
