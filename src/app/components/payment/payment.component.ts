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

  publicKey: string = environment.stripe.publicKey;

  @Input()
  amount: number;

  @Input()
  paymentType: StripePaymentType;

  @Input()
  itemId: string = ''

  @Input()
  email: string = '';

  emailControl = new FormControl('');

  @Input()
  showEmail:boolean = false;

  @Input()
  orderId: number;

  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService,
    private informationService: InformationService,


  ) {}

  checkout() {
    this.clearControl();
    if (this.validate()) {
      this.paymentService.createPayment(this.orderId, '').pipe(
        switchMap(res => {
          return this.stripeService.redirectToCheckout({sessionId: res.id})
        })
      ).subscribe(result => {
        if (result.error) {
          alert(result.error.message);
        }
      });
    }

  }

  clearControl() {
    this.emailControl.markAsPristine();

  }

  validate(): boolean {
    const emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    let isValid = true;

    if (!this.email.match(emailRegex)) {
      this.emailControl.setErrors({emailCorrectError: false});
      this.emailControl.markAsDirty();
      isValid = false;
    }
    return isValid;
  }

  getErrorText(errors: any): string {

    return  this.informationService.getErrorText(errors);
  }

}
