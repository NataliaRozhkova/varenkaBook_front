import {Component, Input} from '@angular/core';
import {CertificateCard} from "../../model/promo";
import {FormControl} from "@angular/forms";
import {InformationService} from "../../services/information.service";
import {StripePaymentType} from "../payment/payment.component";
import {Order} from "../../model/order";
import {map, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.less']
})
export class CertificateComponent {

  certificate: CertificateCard = new CertificateCard();

  nameControl = new FormControl('');
  emailControl = new FormControl('');
  phoneControl = new FormControl('');
  nifControl = new FormControl('');

  constructor(
    private infoService: InformationService,
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.certificate.photo = environment.certificateImage;


  }
  addToCart(){}



}

