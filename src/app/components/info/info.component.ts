import {Component, OnDestroy, OnInit} from '@angular/core';
import {InformationService} from "../../services/information.service";
import {Subject, takeUntil} from "rxjs";
import {environment} from "../../../environments/environment";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit, OnDestroy{

  addressLink: string;
  shopAddress : string;
  textAbout:string = "";
  textAbout2:string = "";

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private informationService: InformationService
  ) {
    this.shopAddress = environment.shopAddress.address;
    this.addressLink = environment.shopAddress.link;
  }


  ngOnInit() {

    this.informationService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
    )
      .subscribe(
      (res: any) => {
        this.textAbout = res.results.find ((value:any) =>  value.name == 'text-about')?.value;
        this.textAbout2 = res.results.find ((value:any) =>  value.name == 'text-about2')?.value;

    })

  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

}




