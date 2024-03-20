import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {CartItem, CartService} from "../../services/cart.service";
import {Certificate, PromoCode} from "../../model/promo";
import {numbers} from "@material/checkbox";
import {ProductService} from "../../services/product.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnDestroy, OnInit, AfterViewInit {

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
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


  constructor(
    private cartService: CartService,
    private router: Router,
    public productService: ProductService,
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();

    this.promocode = this.cartService.getPromocodeFromStorage();
    this.cardGifts = this.cartService.getGiftCardsFromStorage();

    this.updateTotalValue();


  }

  ngOnInit() {

    this.cartService.cartChange.pipe(
      takeUntil(this.destroySubject))
      .subscribe((next) => {
        this.productsCount = this.cartService.getCartCount();
        this.products = this.cartService.getProducts();
        this.updateTotalValue();

      })


  }

  getProductsInStock(): CartItem[] | [] {
    return this.products.filter((cart) => cart?.product?.availability?.status == 'in_stock')
  }


  getProductsToOrder(): CartItem[] | [] {
    return this.products.filter((cart) => cart.product?.availability?.status == 'available_to_order')
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

    let giftCard: PromoCode;
    let promocode: PromoCode;
    this.errorCard = false;
    this.errorCertificate = false;
    this.cardUsed = false;

    if (this.giftCard) {
      this.cartService.getPromocodeInfo(this.giftCard).pipe(
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

      this.cartService.getGiftCardsInfo(this.giftCard).pipe(
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
    // this.totalValue = this.productService.roundPrice(totalValue);
    // this.totalValueDiscount = this.productService.roundPrice(totalValueDiscount);

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
    this.countDiscountValue()
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
