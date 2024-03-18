import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'varenka_front';

  onActivate() {

    document?.scrollingElement?.scrollTo(0,0)
  }
}
