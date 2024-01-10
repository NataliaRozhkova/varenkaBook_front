import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from "../services/cart.service";
import {Router} from "@angular/router";
import {catchError, map, Subject, switchMap, takeUntil} from "rxjs";
import {Address, DeliveryType, Order} from "../model/order";
import {
  FormControl, FormGroup,
} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgSelectModule, NgOption} from '@ng-select/ng-select';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnDestroy, OnInit {

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
  productsCount: number;

  order: Order = new Order();
  deliveryAddress = new Address();

  deliveryTypes: DeliveryType[] = [];
  pickPoints: Address[] = [];
  deliveryType: string = '';

  nameControl = new FormControl('');
  emailControl = new FormControl('');
  phoneControl = new FormControl('');
  deliveryTypeControl = new FormControl('');
  postalCodeControl = new FormControl('');
  countryControl = new FormControl('');
  cityControl = new FormControl('');
  streetControl = new FormControl('');
  buildingNumberControl = new FormControl('');
  appartmentNumberControl = new FormControl('');

  orderControls = new FormGroup({
    name: this.nameControl,
    email: this.emailControl,
    phoneNumber: this.phoneControl,
    deliveryType: this.deliveryTypeControl,
    postalCode: this.postalCodeControl,
    country: this.countryControl,
    city: this.cityControl,
    street: this.streetControl,
    buildingNumber: this.buildingNumberControl,
    appartmentNumber: this.appartmentNumberControl,
  })

  deliveryTypeNames: any = {
      "pickup_from_warehouse": 'Самовывоз в Порту',
      "pick_point": 'Самовывоз из пункта выдачи',
      "courier_delivery": 'Доставка курьером на дом',
      "mail_delivery":'Доставка почтой',
  }


  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();
    this.order = JSON.parse(sessionStorage.getItem('order') || '{}');
    console.log('*-*-*-* --*--**  ', this.order.deliveryType)
    this.deliveryType = this.order.deliveryType.type;

    if (this.order.deliveryAddress) {
      this.deliveryAddress = this.order.deliveryAddress;
    } else {
      this.order.deliveryAddress = new Address()
    }


  }

  ngOnInit(): void {


    this.productService.getDeliveryTypes().pipe(
      takeUntil(this.destroySubject),
      switchMap((types: any) => {
        this.deliveryTypes = types.results;
        return this.productService.getPickPoints()
      }),
      map((response: any) => {
        this.pickPoints = response?.results;
      })
    ).subscribe()


  }

  onSubmit() {
    if (this.validate()) {
      this.order.deliveryType = new DeliveryType();
      this.order.deliveryType.type = this.deliveryType;
      console.log('*-*-*-* --*--**  ', this.deliveryType)
      this.productService.createOrder(this.order).pipe(
        takeUntil(this.destroySubject),
      )
        .subscribe(resp => {
            console.log('***************   ', resp)
          },
          err => {
            this.resolveErrors(err)
          })

    }

  }

  validate(): boolean {

    // if (!this.order.name) {
    //   this.errors['name'] = ['Это поле не может быть пустым']
    // }
    let valid = true;
    // this.nameControl.setErrors({'sdfsdfsdfsd': true})
    // this.emailControl.setErrors({'sdfsdfssdfsdfsdfdfsd': true})

    return valid;
  }


  ngOnDestroy() {
    this.destroySubject.next();
    sessionStorage.setItem('order', JSON.stringify(this.order))
  }

  resolveErrors(httpErrorResponse: HttpErrorResponse) {

    let errors = httpErrorResponse.error;
    Object.keys(errors).forEach((key) => {
      this.orderControls.get(key)?.setErrors(errors[key]);
    })

  }


}

