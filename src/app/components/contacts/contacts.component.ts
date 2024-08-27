import {Component, OnDestroy, OnInit} from '@angular/core';
import {InformationService} from "../../services/information.service";
import {Subject, takeUntil} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.less']
})
export class ContactsComponent implements OnInit, OnDestroy{

  addressLink: string;
  shopAddress : string;
  worktime : string;
  phone : string;
  email : string;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private informationService: InformationService
  ) {
    this.shopAddress = environment.shopAddress.address;
    this.addressLink = environment.shopAddress.link;
  }

  ngOnInit(): void {
    this.informationService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
    )
      .subscribe(
        (res: any) => {
          this.shopAddress = res.results.find ((value:any) =>  value.name == 'address')?.value;
          this.addressLink = res.results.find ((value:any) =>  value.name == 'addressLink')?.value;
          this.worktime = res.results.find ((value:any) =>  value.name == 'worktime')?.value;
          this.phone = res.results.find ((value:any) =>  value.name == 'phone')?.value;
          this.email = res.results.find ((value:any) =>  value.name == 'email')?.value;

        })
  }



  ngOnDestroy() {
    this.destroySubject.next();
  }

}




