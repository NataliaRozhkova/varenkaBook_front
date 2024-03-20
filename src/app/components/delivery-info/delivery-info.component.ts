import {Component, OnDestroy, OnInit} from '@angular/core';
import {InformationService} from "../../services/information.service";
import {Subject, takeUntil} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.less']
})
export class DeliveryInfoComponent implements OnInit, OnDestroy{

  addressLink: string;
  shopAddress : string;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private informationService: InformationService
  ) {
    this.shopAddress = environment.shopAddress.address;
    this.addressLink = environment.shopAddress.link;
  }

  ngOnInit(): void {
  }



  ngOnDestroy() {
    this.destroySubject.next();
  }

}




