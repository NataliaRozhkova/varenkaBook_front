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
import {CartCertificatetItem, CartItem, CartService} from "../../services/cart.service";
import {Router} from "@angular/router";
import {
  map,
  Observable,
  Observer,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import {
  CertificateInOrder,
  CertificatesOrder, CertificateType,
  DeliveryType,
  Order,
  OrderType,
  PickPoint,
  ProductID,
  ProductInOrder
} from "../../model/order";
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
import {CertificateItem, PaymentItem, PaymentItemsType, PaymentParameters} from "../../model/models";
import {InformationService} from "../../services/information.service";
import {Certificate, PromoCode} from "../../model/promo";


@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnDestroy, OnInit, ComponentCanDeactivate, AfterViewInit, AfterContentInit {

  order: Order = new Order();
  preorder: Order = new Order();
  certificatesOrder: CertificatesOrder = new CertificatesOrder();

  orders: Order[] = [];

  screenWidth: number;

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
  certificates: CartCertificatetItem[] = [];
  productsCount: number;
  cdr = inject(ChangeDetectorRef);

  @ViewChild('paymentComponent')
  paymentComponent: PaymentComponent;

  content:any;

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
  regionControl = new FormControl('');
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

  orderHasErrors: boolean = false;

  orderControls = this._formBuilder.group({
    name: this.nameControl,
    email: this.emailControl,
    phoneNumber: this.phoneControl,
    deliveryType: this.deliveryTypeControl,
    postalCode: this.postalCodeControl,
    country: this.countryControl,
    region: this.regionControl,
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

  @ViewChild('dialog') myDialog = {} as TemplateRef<string>;
  private dialogRef: any;


  pageIndex = 0;
  pageCount = 4;
  showAddress: boolean = false;
  pickPointsShow: boolean = false;
  deliveryPortugal: boolean = false;

  constructor(
    public cartService: CartService,
    private router: Router,
    public productService: ProductService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private infoService: InformationService
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();
    this.certificates = this.cartService.getCertificates();
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {

    this.canDeactivatePage = false;


    if (this.products.length == 0 && this.certificates.length == 0) {
      this.canDeactivatePage = true;
      this.router.navigate(['main'])

    }

    this.content = document.getElementById('content');


    this.promoCode = this.cartService.getPromocodeFromStorage();


    this.orderControls.valueChanges.subscribe(
      (event) => {
        this.resolveErrors(this.orderResponse);
      }
    );

    this.deliveryTypeControl.valueChanges.subscribe(
      (event) => {
        if (event == 'courier_delivery' || event == 'mail_delivery' || event == 'mail_delivery_europe') {

          this.showAddress = true;
        } else {
          this.showAddress = false;
        }

        if (event == 'pick_point') {
          this.pickPointsShow = true;
        } else {
          this.pickPointsShow = false;

        }

        if (event == 'mail_delivery') {
            this.countryControl.setValue('Portugal');
            this.order.country = 'Portugal';
            this.countryControl.disable();
            this.regionControl.enable();
            this.cityControl.enable();
            this.order.city = '';
            this.order.region = '';
        } else  if (event == 'courier_delivery') {
            this.countryControl.setValue('Portugal');
            this.regionControl.setValue('Porto');
            this.cityControl.setValue('Porto');
            this.order.country = 'Portugal';
            this.order.region = 'Porto';
            this.order.city = 'Porto';
            this.countryControl.disable();
            this.regionControl.disable();
            this.cityControl.disable();
        } else {
            this.countryControl.enable();
            this.regionControl.enable();
            this.cityControl.enable();
            this.countryControl.setValue('');
            this.order.country = '';
            this.order.region = '';
            this.order.city = '';
        }

      }
    );

    this.phoneControl.valueChanges.pipe(
      switchMap(val => {
        let phone = '';
        if (val) {
          phone = val.replaceAll(" ", "").replaceAll("+", "");
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

    if (this.productsToOrder.length == 0 || this.productsInStock.length == 0) {

      this.jointDelivery = false;
      this.order.jointOrder = null;
      this.order.jointDelivery = false;
    }

  }

  onSubmit(status: string) {

    if (this.validate()) {
      this.setOrderFields();
      if (this.productsToOrder?.length != 0) {
        this.createPreorder();
      }
      this.setCertificatesOrderInfo();
      this.setProductsToOrders();

      this.certificatesOrder.orderStatus.status = status;

      this.order.orderStatus.status = status;
      this.preorder.orderStatus.status = status;

      let emptyPreorder: boolean = this.productsToOrder.length == 0;
      let emptyOrder: boolean = this.productsInStock.length == 0;
      let emptyCertificate: boolean = this.certificates.length == 0;

      let certificateOrd = emptyCertificate ? null : this.certificatesOrder;

      if (emptyPreorder && emptyOrder && !emptyCertificate) {
        this.submitCertificateOrder(status)
      }

      if (!emptyOrder && emptyPreorder) {
        this.submitOrders(this.order, null, certificateOrd)
      }

      if (emptyOrder && !emptyPreorder) {
        this.submitOrders(this.preorder, null, certificateOrd)
      }

      if (!emptyOrder && !emptyPreorder) {
        this.submitOrders(this.order, this.preorder, certificateOrd)
      }
    }
  }


  setOrderToStorage() {

    this.setOrderFields();

  }

  setCertificatesOrderInfo() {
    this.certificatesOrder.email = this.order.email;
    this.certificatesOrder.name = this.order.name;
    this.certificatesOrder.nif = this.order.nif;
    this.certificatesOrder.phoneNumber = this.order.phoneNumber;
    this.certificatesOrder.concentDataProcessing = this.order.concentDataProcessing;
    this.certificatesOrder.concentNewsletters = this.order.concentNewsletters;

    this.certificatesOrder.certificatesInOrder = [];

    this.certificates.forEach((pr) => {
      this.certificatesOrder.certificatesInOrder.push(new CertificateInOrder({
        quantity: pr.count,
        certificateType: new CertificateType({id: pr.certificate.id})
      }))
    })
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


    params.email = this.order.email ? this.order.email : this.preorder.email

    let certificateToUse: Certificate[] = this.cartService.getGiftCardsFromStorage();

    if (certificateToUse) {

      certificateToUse.forEach(cet => {
        params.certificates.push(new CertificateItem(cet.number))

      })
    }

    if (this.productsInStock.length > 0 || this.productsToOrder.length > 0) {

      let orderItem = new PaymentItem();
      orderItem.id = this.order.id;
      orderItem.type = PaymentItemsType.order;
      orderItem.quantity = 1;
      params.items.push(orderItem)
      urlId += this.order.id + ":";

    }


    if (this.productsToOrder.length > 0 && this.productsInStock.length > 0) {
      let preorderItem = new PaymentItem();
      preorderItem.id = this.preorder.id;
      preorderItem.type = PaymentItemsType.order;
      preorderItem.quantity = 1;
      params.items.push(preorderItem)
      urlId += this.preorder.id + ":";

    }

    if (this.certificates.length > 0) {
      let certificateOrderItem = new PaymentItem();
      certificateOrderItem.id = this.certificatesOrder.id;
      certificateOrderItem.type = PaymentItemsType.certificate;
      certificateOrderItem.quantity = 1;
      params.items.push(certificateOrderItem)
      urlId += this.certificatesOrder.id;
    }

    params.cancel_url = environment.dns + "order-result/cancel/" + urlId;
    params.success_url = environment.dns + "order-result/success/" + urlId + "/";

    params.currency = 'eur';


    return params;


  }


  @HostListener('window:popstate', ['$event'])
  pospateReject(event: any) {
    this.router.navigate(['main'])
  }


  submitCertificateOrder(status: string) {

    this.loadOrder = true;
    this.certificatesOrder.orderStatus.status = status;

    this.productService.saveCertificateOrder(this.certificatesOrder).pipe(
      takeUntil(this.destroySubject),
    ).subscribe((resp) => {
      this.loadOrder = false;

      this.certificatesOrder = resp

    })

  }

  submitOrders(order: Order, preorder: Order | null, certificateOrder: CertificatesOrder | null) {

    this.loadOrder = true;

    this.productService.saveOrder(order).pipe(
      takeUntil(this.destroySubject),

      switchMap((response: any) => {
        this.order = response;
        if (preorder) {
          this.preorder.jointOrder = response.id
          return this.productService.saveOrder(preorder)
        } else {
          return this.getPriveousRespone(response)
        }
      }),

      switchMap((response: any) => {

        if (preorder) {
          this.preorder = response;
          this.order.jointOrder = response.id;
        }
        if (certificateOrder) {
          return this.productService.saveCertificateOrder(certificateOrder)
        } else {
          return this.getPriveousRespone(response)
        }
      }),
      map((response: any) => {
        if (certificateOrder) {
          this.certificatesOrder = response;
        }
        this.loadOrder = false;

      })
    ).subscribe(resp => {
      },
      err => {

        this.orderHasErrors = true;
        this.orderResponse = err;
        this.resolveErrors(err)
        this.loadOrder = false;

      })


  }

  getPriveousRespone(resp: any): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      observer.next(resp);
      observer.complete();
    });

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
      this.preorder.payForDelivery = this.jointDelivery;
      this.preorder.pickPoint = this.order.pickPoint;
      this.preorder.jointOrder = this.order.id;
    }

    this.preorder.promoCode  = this.promoCode;
;
  }

  setProductsToOrders() {
    this.order.productsInOrder = [];
    this.preorder.productsInOrder = [];
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

  getFullOrdersPrice(): any {

    let fullPrice = 0;

    if (this.productsInStock.length > 0 || this.productsToOrder.length > 0) {
      fullPrice += this.order.fullPrice;
    }

    if (this.productsToOrder.length > 0 && this.productsInStock.length > 0) {
      fullPrice += this.preorder.fullPrice;
    }

    if (this.certificatesOrder.orderPrice) {
      fullPrice += this.certificatesOrder.orderPrice;
    }
    let certificatesPayment: number = 0;


    this.cartService.getGiftCardsFromStorage().forEach((item) => {
      certificatesPayment += item.amount
    });

    let result = fullPrice - certificatesPayment;

    return result > 0 ? this.productService.roundPriceStr(result) : 0;
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
    this.orderHasErrors = false;
    this.clearControls();
    return this.validatePersonalInfo() && this.validateDelivery() && this.validateAgreement();
  }

  changeStep(ind: number) {

    if (this.content) {
      this.content.scrollTop = 0;

    }

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

      if (this.pageIndex == 0 && this.productsToOrder.length == 0 && this.productsInStock.length == 0) {
        this.pageIndex += 2;
      } else {
        this.pageIndex += 1;
      }
    }
    if (ind < 0) {
      this.pageIndex -= 1;
    }

    this.resolveErrors(this.orderResponse);


    this.cdr.detectChanges();
    window.scrollTo(0, 0)


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

    if (this.certificates.length > 0 && this.productsToOrder.length == 0 && this.productsInStock.length == 0) {
      return isValid;
    }

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
    return this.deliveryTypes.filter(type => type.type != 'joint_delivery')
  }

  getJointDeliveryType(): DeliveryType {
    return this.deliveryTypes.filter(type => type.type == 'joint_delivery')[0]
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
        // data: 123, height: '400px', width: '250px',
      });
    if (this.canDeactivatePage) {
      this.dialog.closeAll()

    }
    return this.dialogRef.afterClosed();


  }

  protected readonly console = console;
}

