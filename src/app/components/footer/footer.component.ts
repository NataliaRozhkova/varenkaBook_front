import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {InformationService} from "../../services/information.service";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit, OnDestroy {

  addressLink: string;
  addres: string;
  telegram: string;
  instagram: string;
  email: string;
  legalInfo: string;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private router: Router
  ) {
    this.addressLink = environment.shopAddress.link;
    this.addres = environment.shopAddress.address;
    this.instagram = environment.instagram;
    this.telegram = environment.telegram;
    this.email = environment.email;
    this.legalInfo = environment.legalInfo;

   }

  ngOnInit(): void {
  }


  navigate($event: any) {
    this.router.navigate([$event], {})

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
