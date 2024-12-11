import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {CartCertificatetItem, CartItem, CartService} from "../../services/cart.service";
import {Certificate, PromoCode} from "../../model/promo";
import {ProductService} from "../../services/product.service";
import {CartCertificateItem, CartCodeItem, CartProductItem, CartRequest, OrdersPriceValues} from "../../model/cart";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnDestroy, OnInit, AfterViewInit {

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
  certificatesToOrder: CartCertificatetItem[] = [];
  productsCount: number;

  giftCard: string = '';

  promocode: PromoCode | null;
  cardGifts: Certificate[] = [];

  errorCard: boolean = false;
  errorCertificate: boolean = false;

  cardUsed: boolean = false;

  totalValue: number = 0.0;
  totalValueDiscount: number = 0.0;

  promocodDiscount: number = 0;
  giftCardsDiscount: number = 0;


  ordersPriceValues: OrdersPriceValues;

  cartRequest: CartRequest;


  constructor(
    private cartService: CartService,
    private router: Router,
    public productService: ProductService,
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();
    this.certificatesToOrder = this.cartService.getCertificates();


    this.promocode = this.cartService.getPromocodeFromStorage();
    this.cardGifts = this.cartService.getGiftCardsFromStorage();

    this.updateTotalValue();

    this.createCartRequest();


  }

  ngOnInit() {

    this.cartService.cartChange.pipe(
      takeUntil(this.destroySubject))
      .subscribe((next) => {
        this.productsCount = this.cartService.getCartCount();
        this.products = this.cartService.getProducts();
        this.certificatesToOrder = this.cartService.getCertificates();
        this.updateTotalValue();

      })

    this.cartService.getCartPrices(this.createCartRequest()).pipe(
      takeUntil(this.destroySubject)
    ).subscribe((resp) => {
      this.ordersPriceValues = resp;
    })


  }

  createCartRequest():  CartRequest{
    let certificates: CartCodeItem[] = [];

    this.cardGifts.forEach((cert) => {
      certificates.push(new CartCodeItem(cert.number))
    })
    let products: CartProductItem[] = [];

    this.products.forEach((pr) => {
      products.push(new CartProductItem(pr.product.id, pr.count))
    })
    let certificatesInCart: CartCertificateItem[] = [];

    this.certificatesToOrder.forEach((cert) => {
      certificatesInCart.push(new CartCertificateItem(cert.certificate.id, cert.count))
    })

    this.cartRequest = new CartRequest()

    if (this.promocode) {
      this.cartRequest.promoCode = new CartCodeItem(this.promocode?.number ? this.promocode?.number : null);
    }

    if (certificates) {
      this.cartRequest.certificates  = certificates;
    }

    if (products) {
      this.cartRequest.products  = products;
    }

    if (certificatesInCart) {
      this.cartRequest.certificatesInCart  = certificatesInCart;
    }

    return  this.cartRequest

  }

  getProductsInStock(): CartItem[] | [] {
    return this.products.filter((cart) => cart?.product?.availability?.status == 'in_stock')
  }


  getProductsToOrder(): CartItem[] | [] {
    return this.products.filter((cart) => cart.product?.availability?.status == 'available_to_order')
  }

  getProductsCount( products: CartItem[]  ) : number {
        let count = 0;
        products.forEach(p  => {count += p.count})

        return count;
  }


  continueShopping() {
    this.router.navigate(['books'])
  }

  createOrder() {

    this.saveToStorage();
    this.router.navigate(['order']);
  }

  saveToStorage() {

    if (this.promocode) {
      this.cartService.setPromocodeToStorage(this.promocode);
    }
    if (this.cardGifts.length > 0) {
      this.cartService.setGiftCardsToStorage(this.cardGifts);
    }
  }

  addGiftCard() {

    this.errorCard = false;
    this.errorCertificate = false;
    this.cardUsed = false;

    if (this.giftCard) {

      if (this.getProductsInStock().length > 0 || this.getProductsToOrder().length > 0) {
        this.cartService.getPromocodeInfo(this.giftCard.trim()).pipe(
          takeUntil(this.destroySubject),
        ).subscribe(
          resp => {
            this.errorCard = false;

            let promocode = resp as PromoCode;

            if (promocode.validity) {
              this.promocode = promocode;
              this.updateTotalValue();

            } else {
              this.errorCard = true;
            }
          },
          err => {
            this.errorCard = true;

          })
      } else {

        this.errorCard = true;

      }
      this.cartService.getGiftCardsInfo(this.giftCard.trim()).pipe(
        takeUntil(this.destroySubject),
      ).subscribe(resp => {

          let giftCard = resp as Certificate;

          if (giftCard.used) {
            this.errorCertificate = true
            this.cardUsed = true;
          } else {
            let usedCard: boolean = this.cardGifts.filter(item => item.number == giftCard.number).length > 0;

            if (usedCard) {
              this.cardUsed = true;
              return
            } else {
              this.cardUsed = false;
              this.cardGifts.push(giftCard);

            }

          }


          this.updateTotalValue();

        },
        err => {
          this.errorCertificate = true;

        })


    }

  }

  countDiscountValue() {

    let fullPrice: any = this.fullPrice();

    this.totalValue = fullPrice.totalValue;

    this.totalValueDiscount = fullPrice.totalValueDiscount;
    let totalValue = fullPrice.totalValue;

    let totalValueDiscount = fullPrice.totalValueDiscount;
    const delimeter: number = 100;

    if (this.promocode) {
      totalValue = (this.promocode.amount ?
        totalValue - this.promocode.amount :
        totalValueDiscount - totalValue * (this.promocode.procent / delimeter));
      totalValueDiscount = this.promocode.amount ?
        totalValueDiscount - this.promocode.amount :
        totalValueDiscount - totalValueDiscount * (this.promocode.procent / delimeter);

    }


    if (this.cardGifts) {

      this.giftCardsDiscount = 0;
      this.cardGifts.forEach((item) => {

        if (item.amount) {

          this.giftCardsDiscount += item.amount;

          totalValue = totalValue - item.amount;
          totalValueDiscount = totalValueDiscount - item.amount
        }

      })

    }
    this.promocodDiscount = fullPrice.totalValueDiscount - totalValueDiscount - this.giftCardsDiscount;

    this.giftCard = '';

  }

  deletePromo() {
    if (this.promocode) {
      this.promocode = null;
      this.updateTotalValue();
      this.cartService.deletePromocodeFromStorage();

    }
  }

  deleteGiftCard(card: Certificate) {

    this.cardGifts = this.cardGifts.filter((item) => item.number != card.number);

    this.cartService.deleteGiftCardsFromStorage();
    if (this.cardGifts.length > 0) {
      this.cartService.setGiftCardsToStorage(this.cardGifts);
    }

    this.updateTotalValue();


  }

  updateTotalValue() {

    this.cartService.getCartPrices(this.createCartRequest()).pipe(
      takeUntil(this.destroySubject)
    ).subscribe((resp) => {
      this.ordersPriceValues = resp;
      console.log( this.ordersPriceValues )
    })

  }

  fullPrice(): any {
    let totalValue = 0;
    let totalValueDiscount = 0;

    this.products.forEach((item) => {

      totalValue = totalValue + (item.product.retailPriceEuro * item.count);
      totalValueDiscount = totalValueDiscount + (item.product.discountPriceEuro * item.count);

    })
    totalValue = this.productService.roundPrice(totalValue);
    totalValueDiscount = this.productService.roundPrice(totalValueDiscount);

    return {
      totalValue: totalValue,
      totalValueDiscount: totalValueDiscount,
    }


  }


  ngOnDestroy() {
    this.saveToStorage()
    this.destroySubject.next();
  }

  ngAfterViewInit(): void {
  }


}
