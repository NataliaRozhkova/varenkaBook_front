import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {find, Subject, takeUntil} from "rxjs";
import {CertificateCard} from "../../model/promo";

@Component({
  selector: 'certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.less']
})
export class CertificateListComponent implements OnDestroy, OnInit {


  private destroySubject: Subject<void> = new Subject();

  certificateTypes: CertificateCard[] = []
  loading = false;
  constructor(
  ) {
  }

  ngOnInit() {
   this.getCertificateTypes();

  }

  getCertificateTypes() {

    let firstCard = new CertificateCard();
    firstCard.id = '1';
    firstCard.value = 20;
    firstCard.photo = '../../../assets/certificates/certificate.png';

    let secondCard = new CertificateCard();
    secondCard.id = '2';
    secondCard.value = 40;
    secondCard.photo = '../../../assets/certificates/certificate.png';

    let thirdCard = new CertificateCard();
    thirdCard.id = '3';
    thirdCard.value = 50;
    thirdCard.photo = '../../../assets/certificates/certificate.png';


    this.certificateTypes = [
      firstCard,
      secondCard,
      thirdCard
    ]
  }



  ngOnDestroy() {
    this.destroySubject.next();
  }


}
