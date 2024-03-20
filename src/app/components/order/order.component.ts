import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component, HostListener,
  inject,
  OnDestroy,
  OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import {CartItem, CartService} from "../../services/cart.service";
import { Router} from "@angular/router";
import { map, Observable,  Subject, switchMap, takeUntil} from "rxjs";
import {DeliveryType, Order, OrderType, PickPoint, ProductID, ProductInOrder} from "../../model/order";
import {
  FormBuilder,
  FormControl,
} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatStepper} from "@angular/material/stepper";
import {environment} from '../../../environments/environment';
import {MatDialog} from "@angular/material/dialog";
import {ComponentCanDeactivate} from "../../directives/guard";
import {PaymentComponent} from "../payment/payment.component";
import {PaymentItem, PaymentItemsType, PaymentParameters} from "../../model/models";
import {InformationService} from "../../services/information.service";
import {PromoCode} from "../../model/promo";


@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnDestroy, OnInit, ComponentCanDeactivate, AfterViewInit, AfterContentInit {

  order: Order = new Order();
  preorder: Order = new Order();

  orders: Order[] = [];

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
  productsCount: number;
  cdr = inject(ChangeDetectorRef);

  @ViewChild('paymentComponent')
  paymentComponent: PaymentComponent;

  canDeactivatePage: boolean = false;

  deliveryTypes: DeliveryType[] = [];
  pickPoints: PickPoint[] = [];
  deliveryType: string = '';
  pickPoint: string = '';
  mainPickPointId: string;

  paymentParameters: PaymentParameters = new PaymentParameters();

  jointDelivery: boolean = false;

  nameControl = new FormControl('');
  emailControl = new FormControl('');
  phoneControl = new FormControl('');
  nifControl = new FormControl('');
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

  loadOrder: boolean = false;

  promoCode: PromoCode;

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
    nif: this.nifControl,
  })

  deliveryTypeNames: any = environment.deliveryTypeNames


  productsInStock: CartItem[];
  productsToOrder: CartItem[];

  @ViewChild('stepper')
  stepper: MatStepper;
  @ViewChild('dialog') myDialog = {} as TemplateRef<string>;
  private dialogRef: any;


  pageIndex = 0;
  pageCount = 4;
  showAddress: boolean = false;
  pickPointsShow: boolean = false;


  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private infoService: InformationService
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();
  }

  ngOnInit(): void {

    this.canDeactivatePage = false;


    if (this.products.length == 0) {
      this.canDeactivatePage = true;
      this.router.navigate(['main'])

    }

    this.promoCode = this.cartService.getPromocodeFromStorage();


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

    this.phoneControl.valueChanges.pipe(
      switchMap(val => {
        let phone = '';
        if (val) {
          phone = val.replaceAll(" ", "").replaceAll("+", "");
          // phone = val.replaceAll("+", "");
        }
        return this.productService.phoneValidate(phone)
      }),
      map(res => {
        if (!res && this.phoneControl.value) {
          this.phoneControl.setErrors({phoneCorrectError: true});
        } else {
          this.phoneControl.markAsPristine();
        }
      })
    ).subscribe();

    this.infoService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
    )
      .subscribe(
        (res) => {
          this.mainPickPointId = res.results.find((value: any) => value.name == 'main-pickpoint')?.value;
        })
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

  ngAfterViewInit() {

  }

  ngAfterContentInit() {
    this.getOrderFromStorage()

  }


  onSubmit(status: string) {
    if (this.validate()) {
      this.setOrderFields();
      this.createPreorder();
      this.setProductsToOrders();

      this.order.orderStatus.status = status;
      this.preorder.orderStatus.status = status;

      if (this.productsInStock.length > 0 && this.productsToOrder.length > 0) {
        this.submitDoubleOrders();
      }

      if (this.productsInStock.length > 0 && this.productsToOrder.length == 0) {
        this.submitSingleOrder(this.order);
      }
      if (this.productsInStock.length == 0 && this.productsToOrder.length > 0) {
        this.submitSingleOrder(this.preorder);
      }

    }

  }

  setOrderToStorage() {

    this.setOrderFields();
    this.cartService.setOrdersToStorage(this.order, 'order');
    this.cartService.setOrdersToStorage(this.preorder, 'preorder');

  }

  getOrderFromStorage() {

    let order = this.cartService.getOrderFromStorage('order');


    let preorder = this.cartService.getOrderFromStorage('preorder');
    if (order) {
      this.order = order;
    }

    if (preorder) {
      this.preorder = preorder;
    }

  }

  payOrder() {
    this.canDeactivatePage = true;
    this.onSubmit('created')
    this.paymentParameters = this.createPaymentParams();
    this.paymentComponent.checkout(this.paymentParameters);
  }

  createPaymentParams(): PaymentParameters {
    let params = new PaymentParameters();

    let urlId = '';


    if (this.productsToOrder.length > 0) {
      params.email = this.order.email;
    } else {
      params.email = this.preorder.email;
    }

    if (this.productsInStock.length > 0 || this.productsToOrder.length > 0) {

      let orderItem = new PaymentItem();
      orderItem.id = this.order.id;
      orderItem.type = PaymentItemsType.order;
      orderItem.quantity = 1;
      params.items.push(orderItem)
      urlId += this.order.id + "/";

    }

    if (this.productsToOrder.length > 0 && this.productsInStock.length > 0) {
      let preorderItem = new PaymentItem();
      preorderItem.id = this.preorder.id;
      preorderItem.type = PaymentItemsType.order;
      preorderItem.quantity = 1;
      params.items.push(preorderItem)
      urlId += this.preorder.id + "/";

    }
    params.cancel_url = environment.dns + "order-result/cancel/" + urlId;
    params.success_url = environment.dns + "order-result/success/" + urlId;

    params.currency = 'eur';


    return params;


  }


  @HostListener('window:popstate', ['$event'])
  pospateReject(event: any) {
    this.router.navigate(['main'])
  }

  submitSingleOrder(order: Order) {
    this.loadOrder = true;
    this.productService.saveOrder(order).pipe(
      takeUntil(this.destroySubject),
    )

      .subscribe(resp => {
          this.order = resp;
          this.setOrderToStorage();
          this.loadOrder = false;

          // this.canDeactivatePage = true;
          //
          // this.payOrder();

        },
        err => {
          this.orderResponse = err;
          this.resolveErrors(err)
          this.loadOrder = false;

        })

  }

  submitDoubleOrders() {
    this.loadOrder = true;

    // if (this.order.jointDelivery) {
    //   this.preorder.jointDelivery = true;
    //   this.order.jointDelivery = true;
    //   this.preorder.pickPoint = null;
    // }

    this.productService.saveOrder(this.order).pipe(
      takeUntil(this.destroySubject),
      switchMap((response: any) => {
        this.order = response;


        if (this.jointDelivery) {
          this.preorder.jointOrder = response.id;
          this.preorder.deliveryType.type = this.getJointDeliveryType().type;
        }
        return this.productService.saveOrder(this.preorder)
      }),
      map((resp: any) => {
        this.preorder = resp;
        if (this.jointDelivery) {
          this.order.jointOrder = resp.id;
        }
        this.setOrderToStorage();
        this.loadOrder = false;


      }),
    )
      .subscribe(resp => {
        },
        err => {
          this.orderResponse = err;
          this.resolveErrors(err)
          this.loadOrder = false;

        })

  }

  createPreorder() {

    let preorderId = this.preorder?.id;
      this.preorder = JSON.parse(JSON.stringify(this.order));
      this.preorder.orderType.type = 'preorder';

      if (preorderId) {
        this.preorder.id = preorderId;
      }
    this.preorder.concentDataProcessing = this.order.concentDataProcessing;
    this.preorder.concentNewsletters = this.order.concentNewsletters;

    if (this.order.jointDelivery) {
      this.preorder.jointDelivery = true;
      this.preorder.pickPoint = null;
      this.preorder.deliveryType.type = this.getJointDeliveryType().type;
      this.preorder.jointOrder = this.order.id;
    }
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
    this.setPickPoint()
    this.order.phoneNumber = this.order.phoneNumber.replaceAll(" ", "");
    this.order.trackPhoneNumber = this.order.trackPhoneNumber?.replaceAll(" ", "");
    this.order.promoCode = this.promoCode;

  }


  setPickPoint() {
    if (this.deliveryType != 'pick_point') {
      this.order.pickPoint = null;
      this.preorder.pickPoint = null;
    } else {
      this.order.pickPoint = new PickPoint();
      this.order.pickPoint.id = this.pickPoint;
    }

    if (this.deliveryType == 'pickup_from_warehouse') {
      this.order.pickPoint = new PickPoint();
      this.order.pickPoint.id = this.mainPickPointId;
    }

  }


  validate(): boolean {
    this.clearControls();
    return this.validatePersonalInfo() && this.validateDelivery() && this.validateAgreement();
  }

  changeStep(ind: number) {

    this.setOrderToStorage();

    if (ind > 0 && (this.pageIndex == 0 && this.validatePersonalInfo() ||
      this.pageIndex == 1 && this.validateDelivery() ||
      this.pageIndex == 2 && this.validateAgreement() ||
      this.pageIndex == 3
    )) {
      this.clearControls();

      if (this.pageIndex == 2) {
        this.onSubmit('draft')
      }

      this.pageIndex += 1;
    }
    if (ind < 0) {
      this.pageIndex -= 1;
    }

    this.resolveErrors(this.orderResponse);


    this.cdr.detectChanges();
    window.scrollTo(0,0)


  }

  validateAgreement(): boolean {

    let isValid = true;

    if (!this.order.concentDataProcessing) {
      this.concentDataProcessingControl.setErrors({concentDataProcessingError: true});
      this.concentDataProcessingControl.markAsDirty();
      isValid = false;

    }
    return isValid;
  }


  validateDelivery(): boolean {

    let isValid = true;

    if (!this.deliveryType) {
      this.deliveryTypeControl.setErrors({deliveryTypeError: true});
      this.deliveryTypeControl.markAsDirty();
      isValid = false;
    }

    if (this.deliveryType == 'pick_point' && !this.pickPoint) {
      this.pickPointControl.setErrors({pickPointError: true});
      this.pickPointControl.markAsDirty();
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
      this.nameControl.setErrors({nameError: true});
      this.nameControl.markAsDirty();

      isValid = false;
    }
    if (!this.order.email) {
      this.emailControl.setErrors({emailNullableError: true});
      this.emailControl.markAsDirty();
      isValid = false;
    }
    const emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"

    if (!this.order.email.match(emailRegex)) {
      this.emailControl.setErrors({emailCorrectError: true});
      this.emailControl.markAsDirty();
      isValid = false;
    }

    if (!this.order.phoneNumber) {

      this.phoneControl.setErrors({phoneNullableError: true});
      this.phoneControl.markAsDirty();
      isValid = false;
    }

    if (this.order.phoneNumber.length < 12) {
      this.phoneControl.setErrors({phoneCorrectError: true});
      this.phoneControl.setErrors({phoneCorrectError: true});

      this.phoneControl.markAsDirty();
      isValid = false;
    }

    const phoneRegx = '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$';
    if (!this.order.phoneNumber.toString().match(phoneRegx)) {
      this.phoneControl.setErrors({phoneCorrectError: true});
      this.phoneControl.markAsDirty();
      isValid = false;
    }

    return isValid;
  }

  trimPhoneNumber($event: string) {
    this.order.phoneNumber = this.order.phoneNumber.toString().substring(0, 10);
  }

  validateAddress(): boolean {
    let isValid = true;

    if (!this.order.postalCode) {
      this.postalCodeControl.setErrors({postalCodeError: true});
      this.postalCodeControl.markAsDirty();
      isValid = false;
    }
    if (!this.order.country) {
      this.countryControl.setErrors({countryError: true})
      this.countryControl.markAsDirty();
      isValid = false;
    }
    if (!this.order.city) {
      this.cityControl.setErrors({cityError: true})
      this.cityControl.markAsDirty();
      isValid = false;
    }
    if (!this.order.street && !this.order.buildingNumber && !this.order.appartmentNumber) {
      isValid = false;
    }

    return isValid;
  }

  clearControls() {
    this.orderControls.markAsPristine();

  }


  ngOnDestroy() {
    this.destroySubject.next();

    sessionStorage.setItem('order', JSON.stringify(this.order))


  }

  getDeliveryTypes(): DeliveryType[] {
    return this.deliveryTypes.filter( type => type.type != 'joint_delivery')
  }

  getJointDeliveryType(): DeliveryType {
    return this.deliveryTypes.filter( type => type.type == 'joint_delivery')[0]
  }

  resolveErrors(httpErrorResponse: HttpErrorResponse) {


    if (!httpErrorResponse) {
      return;
    }

    let errors = httpErrorResponse.error;

    Object.keys(errors).forEach((key) => {

      this.orderControls.setErrors([this.errorFromCode(key)])

      let errKey = this.getErrorFromKey(errors[key]);
      let error: any = {};
      error[errKey] = true;
      this.orderControls.get(key)?.setErrors(
        error
      );
      this.orderControls.get(key)?.markAsDirty();

    })

  }

  getErrorFromKey(key: string): string {

    if (environment.errors[key as keyof typeof environment.errors]) {
      return key;
    }
    return 'fieldError'
  }

  getProductsFromStatus(availability: string): CartItem[] {
    return this.products?.filter((pr) => pr.product.availability.status == availability)
  }

  errorFromCode(code: string): string {
    return environment.errors[code as keyof typeof environment.errors]
  }

  getErrorText(errors: any): string {
    return this.infoService.getErrorText(errors);
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

  getMainPickPointAddress(): string {
    let mainPickPoint = this.pickPoints.filter((pickPoint) => pickPoint.id == this.mainPickPointId)[0];

    return this.getStringAddress(mainPickPoint);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> {


    this.dialogRef = this.dialog.open(this.myDialog,
      {
        data: 123, height: '400px', width: '250px',
      });
    if (this.canDeactivatePage) {
      this.dialog.closeAll()

    }
    return this.dialogRef.afterClosed();


  }

  protected readonly console = console;
}

