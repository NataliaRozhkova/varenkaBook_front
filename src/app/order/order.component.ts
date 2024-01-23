import {
  ChangeDetectorRef,
  Component, ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CartItem, CartService} from "../services/cart.service";
import {Router} from "@angular/router";
import {catchError, map, Subject, switchMap, takeUntil} from "rxjs";
import {Address, DeliveryType, Order, OrderType, PickPoint, ProductID, ProductInOrder} from "../model/order";
import {
  FormBuilder,
  FormControl, FormGroup, Validators,
} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatStepper} from "@angular/material/stepper";
import {PhoneMaskDirective} from "../directives/phone-mask.directive";
import {Product} from "../model/product";

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnDestroy, OnInit {

  order: Order = new Order();
  preorder: Order = new Order();

  orders: Order[] = [];

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
  productsCount: number;
  cdr = inject(ChangeDetectorRef);


  deliveryTypes: DeliveryType[] = [];
  pickPoints: PickPoint[] = [];
  deliveryType: string = '';
  pickPoint: string = '';

  jointDelivery: boolean = false;

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
  concentDataProcessingControl = new FormControl('');
  concentNewslettersControl = new FormControl('');
  pickPointControl = new FormControl('');


  orderResponse: HttpErrorResponse;

  orderControls = this._formBuilder.group({
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
    concentDataProcessing: this.concentNewslettersControl,
    concentNewsletters: this.concentNewslettersControl,
    pickPoint: this.pickPointControl,
  })


  // matcher = new MyErrorStateMatcher();

  deliveryTypeNames: any = {
    "pickup_from_warehouse": 'Самовывоз в Порту',
    "pick_point": 'Самовывоз из пункта выдачи',
    "courier_delivery": 'Доставка курьером на дом',
    "mail_delivery": 'Доставка почтой',
  }

  productsInStock: CartItem[];
  productsToOrder: CartItem[];

  @ViewChild('stepper')
  stepper: MatStepper;

  pageIndex = 0;
  pageCount = 4;
  showAddress: boolean = false;
  pickPointsShow: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();
  }

  ngOnInit(): void {

    this.orderControls.valueChanges.subscribe(
      (event) => {
        this.resolveErrors(this.orderResponse);
      }
    );

    this.deliveryTypeControl.valueChanges.subscribe(
      (event) => {
        if (event == 'courier_delivery' || event == 'mail_delivery') {

          this.showAddress = true;
        } else {
          this.showAddress = false;
        }

        if (event == 'pick_point') {
          this.pickPointsShow = true;
        } else {
          this.pickPointsShow = false;

        }
      }
    );
    this.productsInStock = this.getProductsFromStatus('in_stock');
    this.productsToOrder = this.getProductsFromStatus('available_to_order');


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

      this.setOrderFields();
      this.createPreorder();
      this.setProductsToOrders();

      this.productService.createOrder(this.order).pipe(
        takeUntil(this.destroySubject),
        switchMap((response: any) => {
          this.order = response;
          return this.productService.createOrder(this.preorder)
        }),
        map((resp: any) => {
          this.preorder = resp;
        })
      )
        .subscribe(resp => {
          },
          err => {
            this.orderResponse = err;
            this.resolveErrors(err)
          })

    }

  }

  createPreorder() {
    if (!this.preorder.id) {
      this.preorder = JSON.parse(JSON.stringify(this.order));
      this.preorder.orderType.type = 'preorder';
    }
    this.preorder.concentDataProcessing = this.order.concentDataProcessing;
    this.preorder.concentNewsletters = this.order.concentNewsletters;
  }

  setProductsToOrders() {
    this.productsInStock.forEach((pr) => {
      this.order.productsInOrder.push(new ProductInOrder({
        product: new ProductID(pr.product.id),
        amount: pr.count,
        fromStock: pr.product.availability.status == 'in_stock'
      }))
    })
    this.order.orderType.type = 'usual';

    this.productsToOrder.forEach((pr) => {
      this.preorder.productsInOrder.push(new ProductInOrder({
        product: new ProductID(pr.product.id),
        amount: pr.count,
        fromStock: pr.product.availability.status == 'in_stock'
      }))
    })
  }

  setOrderFields() {
    this.order.deliveryType = new DeliveryType();
    this.order.deliveryType.type = this.deliveryType;
    this.order.orderType = new OrderType();
    this.order.orderStatus.status = 'created';
    this.setPickPoint()
    this.order.phoneNumber = this.order.phoneNumber.replaceAll(" ", "");

  }

  setPickPoint() {
    if (this.deliveryType != 'pick_point') {
      this.order.pickPoint = null;
      this.preorder.pickPoint = null;
    } else {
      this.order.pickPoint = new PickPoint();
      this.order.pickPoint.id = this.pickPoint;
    }

  }


  validate(): boolean {
    this.clearControls();
    return this.validatePersonalInfo() && this.validateDelivery() && this.validateAgreement();
  }

  changeStep(ind: number) {

    if (ind > 0 && (this.pageIndex == 0 && this.validatePersonalInfo() ||
      this.pageIndex == 1 && this.validateDelivery() ||
      this.pageIndex == 2 && this.validateAgreement() ||
      this.pageIndex == 3
    )) {
      this.clearControls();
      this.pageIndex += 1;
    }
    if (ind < 0) {
      this.pageIndex -= 1;
    }
    this.resolveErrors(this.orderResponse);

    this.cdr.detectChanges();

  }

  validateAgreement(): boolean {

    let isValid = true;

    if (!this.order.concentDataProcessing) {
      this.concentDataProcessingControl.setErrors({'Поле не может быть пустым': true});
      this.concentDataProcessingControl.markAsDirty();
      isValid = false;

    }
    return isValid;
  }


  validateDelivery(): boolean {

    let isValid = true;

    if (!this.deliveryType) {
      this.deliveryTypeControl.setErrors({'Поле не может быть пустым': true});
      this.deliveryTypeControl.markAsDirty();
      isValid = false;
    }

    if (this.deliveryType == 'courier_delivery' || this.deliveryType == 'mail_delivery') {
      isValid = this.validateAddress();
    }


    return isValid;
  }

  validatePersonalInfo(): boolean {

    let isValid = true;
    if (!this.order.name) {
      this.nameControl.setErrors({'Поле не может быть пустым': true});
      this.nameControl.markAsDirty();

      isValid = false;
    }
    if (!this.order.email) {
      this.emailControl.setErrors({'Поле не может быть пустым': true});
      this.emailControl.markAsDirty();
      isValid = false;
    }
    const emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"

    if (!this.order.email.match(emailRegex)) {
      this.emailControl.setErrors({'Введите корректный email': false});
      this.emailControl.markAsDirty();
      isValid = false;
    }

    if (!this.order.phoneNumber) {
      this.phoneControl.setErrors({'Поле не может быть пустым': true});
      this.phoneControl.markAsDirty();
      isValid = false;
    }

    const phoneRegx = '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$';
    if (!this.order.phoneNumber.toString().match(phoneRegx)) {
      this.phoneControl.setErrors({'Введите корректный телефон': true});
      this.phoneControl.markAsDirty();
      isValid = false;
    }

    return isValid;
  }

  validateAddress(): boolean {
    let isValid = true;

    if (!this.order.postalCode) {
      this.postalCodeControl.setErrors({'Поле не может быть пустым': true});
      this.postalCodeControl.markAsDirty();
      isValid = false;
    }
    if (!this.order.country) {
      this.countryControl.setErrors({'Поле не может быть пустым': true})
      this.countryControl.markAsDirty();
      isValid = false;
    }
    if (!this.order.city) {
      this.cityControl.setErrors({'Поле не может быть пустым': true})
      this.cityControl.markAsDirty();
      isValid = false;
    }
    if (!this.order.street && !this.order.buildingNumber && !this.order.appartmentNumber) {
      isValid = false;
    }


    return isValid;
  }

  clearControls() {
    console.log("--- clearControls----")
    this.orderControls.markAsPristine();

  }


  ngOnDestroy() {
    this.destroySubject.next();
    sessionStorage.setItem('order', JSON.stringify(this.order))
  }

  resolveErrors(httpErrorResponse: HttpErrorResponse) {


    console.log("-*-**-* ", httpErrorResponse)
    if (!httpErrorResponse) {
      return;
    }
    let errors = httpErrorResponse.error;
    Object.keys(errors).forEach((key) => {

      this.orderControls.get(key)?.setErrors(errors[key]);
      this.orderControls.get(key)?.markAsDirty();

    })

  }

  getProductsFromStatus(availability: string): CartItem[] {
    return this.products?.filter((pr) => pr.product.availability.status == availability)
  }

  getStringAddress(obj: any): string {
    return (obj.postalCode ? obj.postalCode + ', ' : '') +
      (obj.country ? obj.country + ', ' : '') +
      (obj.region ? obj.region + ', ' : '') +
      (obj.city ? obj.city + ', ' : '') +
      (obj.street ? obj.street + ', ' : '') +
      (obj.buildingNumber ? obj.buildingNumber + ', ' : '') +
      (obj.appartmentNumber ? obj.appartmentNumber + ', ' : '')
  }

  setOrder() {

    const saveOrder = JSON.parse(sessionStorage.getItem('order') || '{}');

  }


  protected readonly alert = alert;
}

