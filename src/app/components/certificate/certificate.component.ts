import {Component, Input} from '@angular/core';
import {CertificateCard} from "../../model/promo";
import {FormControl} from "@angular/forms";
import {InformationService} from "../../services/information.service";
import {StripePaymentType} from "../payment/payment.component";
import {Order} from "../../model/order";
import {map, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {environment} from "../../../environments/environment";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Product} from "../../model/product";
import {Slide} from "../../model/models";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.less']
})
export class CertificateComponent {

  certificate: CertificateCard = new CertificateCard({});

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
  ) {
  }

  ngOnInit(): void {


    // this.productService.getCertificateType()
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.productService.getCertificateTypes(params?.get('id'));
        }
      ),
      map((res: CertificateCard) => {

        this.certificate = res;
        this.certificate.photo = environment.certificateImage;
      })
    )
      .subscribe();

  }
  addToCart(){
    this.cartService.addCertificatesToCart(this.certificate)
  }



}

