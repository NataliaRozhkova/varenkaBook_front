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

  country: string;

  @ViewChild('countryDialog') myDialog = {} as TemplateRef<string>;
  private countryDialog: any;

  constructor(private pageService: PageService,
              private cookieService: CookieService,
              private router: Router,
              public dialog: MatDialog,

  ) {

    this.country = this.cookieService.get('country');
  }



  onActivate() {

    let scrollElement = document.getElementById('content')

    scrollElement?.scrollTo(0, 0)
    scrollElement?.scroll(0,0)
  }

  ngOnInit(): void {

    this.pageService.setMetaTagBase();
    this.pageService.setBaseTitle();

    console.log("************************")
    console.log(this.cookieService.get('country'))
    console.log("************************")

    // let countryChoose = this.cookieService.get('country');

    if (this.country) {
    this.showCountryDialog(true)
    } else {
      console.log("go to main")
    }


  }

  showCountryDialog($event: boolean) {

    if ($event) {
      this.countryDialog = this.dialog.open(this.myDialog,
        {
          data: 123, height: '50px', width: '90%',
          scrollStrategy: new NoopScrollStrategy(),
          disableClose: true,
          position:{top: '30px'}


        });
      this.countryDialog.disableClose = true;

    } else  {
      this.closePanel();
    }


  }

  closePanel() {
    this.dialog.closeAll()
  }

}
