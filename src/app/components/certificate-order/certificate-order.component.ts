import {Component, OnDestroy, OnInit} from '@angular/core';
import {InformationService} from "../../services/information.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'certificate-order',
  templateUrl: './certificate-order.component.html',
  styleUrls: ['./certificate-order.component.less']
})
export class CertificateOrderComponent implements OnInit, OnDestroy{

  addressLink: string;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private informationService: InformationService
  ) {
  }

  ngOnInit(): void {

    this.informationService.getFrontParams().pipe(takeUntil(this.destroySubject),
    )
      .subscribe(
        (res) => {
          this.addressLink = res.results.find ((value:any) =>  value.name == 'address')?.value;

        })

  }



  ngOnDestroy() {
    this.destroySubject.next();
  }

}
