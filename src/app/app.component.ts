import {Component, OnInit} from '@angular/core';
import {PageService} from "./services/page.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements  OnInit{
  title = 'varenka_front';

  constructor(private pageService: PageService) {
  }



  onActivate() {

    let scrollElement = document.getElementById('content')

    scrollElement?.scrollTo(0, 0)
    scrollElement?.scroll(0,0)
  }

  ngOnInit(): void {

    this.pageService.setMetaTagBase();
    this.pageService.setBaseTitle();
  }

}
