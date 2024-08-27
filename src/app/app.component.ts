import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageService} from "./services/page.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {NoopScrollStrategy} from "@angular/cdk/overlay";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements  OnInit{
  title = 'varenka_front';



  constructor(private pageService: PageService,
              private cookieService: CookieService,
              private router: Router,

  ) {

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
