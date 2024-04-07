import {Component, Input} from '@angular/core';
import {InformationService} from "../../services/information.service";
import {StripeService} from "ngx-stripe";
import { Observable, Observer, switchMap} from "rxjs";
import {PaymentService} from "../../services/payment.service";
import {FormControl} from "@angular/forms";
import {PaymentParameters} from "../../model/models";
import {Router} from "@angular/router";

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

  checkout(params: PaymentParameters) {

    this.paymentParameters = params;
    this.clearControl();
    if (this.validate()) {
      this.paymentService.createPayment(params).pipe(
        switchMap(res => {

          if (!res?.id) {
            return new Observable((observer: Observer<any>) => {
              observer.next(res);
              observer.complete();
            });
          }

          return this.stripeService.redirectToCheckout({sessionId: res.id})
        })
      ).subscribe(result => {
        if (result.error) {
          alert(result.error.message);
        } else  {
          let orders = ''
          params.items.forEach((item) => {
            orders += item.id + ":";
          })

          this.router.navigate(['order-result/success/',orders ])


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
