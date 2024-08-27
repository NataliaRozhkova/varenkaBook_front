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
  telegram: string;
  instagram: string;
  email: string;
  legalInfo: string;

  shopInfo: string;
  ownerinfo: string;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private informationService: InformationService

  ) {
    this.addressLink = environment.shopAddress.link;
    this.instagram = environment.instagram;
    this.telegram = environment.telegram;
    this.email = environment.email;
    this.legalInfo = environment.legalInfo;

   }

  ngOnInit(): void {

    this.informationService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
    )
      .subscribe(
        (res: any) => {
          this.shopInfo = res.results.find ((value:any) =>  value.name == 'shopinfo')?.value;
          this.ownerinfo = res.results.find ((value:any) =>  value.name == 'ownerinfo')?.value;
          this.addressLink = res.results.find ((value:any) =>  value.name == 'addressLink')?.value;
          this.email = res.results.find ((value:any) =>  value.name == 'email')?.value;

        })
  }


  navigate($event: any) {
    this.router.navigate([$event], {})

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
