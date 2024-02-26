import {Component} from '@angular/core';
import {CertificateCard} from "../../model/promo";
import {FormControl} from "@angular/forms";
import {InformationService} from "../../services/information.service";
import {StripePaymentType} from "../payment/payment.component";

@Component({
  selector: 'certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.less']
})
export class CertificateComponent {

  certificate: CertificateCard = new CertificateCard();


  constructor(
  ) {
  }

  ngOnInit(): void {


    this.certificate.id = '1';
    this.certificate.value = 100;
    this.certificate.photo = '../../assets/certificates/certificate.png';
  }

  protected readonly StripePaymentType = StripePaymentType;
}

