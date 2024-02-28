import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {loadStripe, Stripe} from "@stripe/stripe-js";
import {InformationService} from "../../services/information.service";
import {DOCUMENT} from "@angular/common";
import {StripeService} from "ngx-stripe";
import {map, switchMap} from "rxjs";
import {HttpService} from "../../services/http.service";
import {PaymentService} from "../../services/payment.service";
import {FormControl} from "@angular/forms";
import {PaymentParameters} from "../../model/models";
import {Router} from "@angular/router";



export enum StripePaymentType {
  Order,
  Certificate
}


@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.less']
})
export class PaymentComponent  {


  @Input()
  paymentParameters: PaymentParameters = new PaymentParameters();

  emailControl = new FormControl('');

  @Input()
  showEmail:boolean = false;


  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService,
    private informationService: InformationService,
    private router: Router,


  ) {}

  checkout(params: any) {
    // this.router.navigate(['main'])

    this.paymentParameters = params;
    this.clearControl();
    if (this.validate()) {
      this.paymentService.createPayment(params).pipe(
        switchMap(res => {
          return this.stripeService.redirectToCheckout({sessionId: res.id})
        })
      ).subscribe(result => {
        if (result.error) {
          alert(result.error.message);
        }
      },
        error => {
          this.emailControl.setErrors({responseError: false});
        }
        );
    }

  }

  clearControl() {
    this.emailControl.markAsPristine();

  }

  validate(): boolean {
    const emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    let isValid = true;

    if (!this.paymentParameters.email?.match(emailRegex)) {
      this.emailControl.setErrors({emailCorrectError: true});
      this.emailControl.markAsDirty();
      isValid = false;
    }
    return isValid;
  }

  getErrorText(errors: any): string {

    return  this.informationService.getErrorText(errors);
  }

}
