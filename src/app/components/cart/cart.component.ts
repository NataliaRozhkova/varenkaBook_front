import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {CartItem, CartService} from "../../services/cart.service";
import {PromoCode} from "../../model/promo";
import {numbers} from "@material/checkbox";
import {ProductService} from "../../services/product.service";

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
  cardGifts: PromoCode[] = [];

  errorCard: boolean = false;
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

    this.promocode = this.cartService.getPromocode();
    this.cardGifts = this.cartService.getGiftCards();

    console.log("------- promocode   ", this.promocode)
    console.log("------- cardGifts   ", this.cardGifts)
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
    return this.products.filter((cart) => cart.product.availability.status == 'in_stock')
  }


  getProductsToOrder(): CartItem[] | [] {
    return this.products.filter((cart) => cart.product.availability.status == 'available_to_order')
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
      this.cartService.setPromocode(this.promocode);
    }
    if (this.cardGifts.length > 0) {
      this.cartService.setGiftCards(this.cardGifts);
    }
  }

  addGiftCard() {

    let card: PromoCode = this.checkCardNumber(this.giftCard)
    this.cardUsed = false;

    if (!card) {
      this.errorCard = true;
    } else {
      this.errorCard = false;

      card = card as PromoCode;

      let usedCard: boolean = this.cardGifts.filter(item => item.number == card.number).length > 0;

      console.log("------card ", card)
      console.log("------card ", this.cardGifts.filter(item => item.number == card.number))

      if (usedCard) {
        this.cardUsed = true;
        return
      } else {
        this.cardUsed = false;

      }

      if (card.cardType == 'gift') {
        this.cardGifts.push(card);
      }
      if (card.cardType == 'promocode') {
        this.promocode = card;
      }
      this.updateTotalValue();

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
      totalValue = (this.promocode.value ?
        totalValue - this.promocode.value :
        totalValue * (this.promocode.discountPercent / delimeter));
      totalValueDiscount = this.promocode.value ?
        totalValueDiscount - this.promocode.value :
        totalValueDiscount * (this.promocode.discountPercent / delimeter);

    }


    if (this.cardGifts) {

      this.giftCardsDiscount = 0;
      this.cardGifts.forEach((item) => {

        if (item.value) {

          this.giftCardsDiscount +=  item.value;

          totalValue = totalValue - item.value;
          totalValueDiscount = totalValueDiscount - item.value
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

  deleteGiftCard(card: PromoCode) {

    this.cardGifts = this.cardGifts.filter((item) => item.number != card.number);

    this.cartService.deleteGiftCardsFromStorage();
    if (this.cardGifts.length > 0) {
      this.cartService.setGiftCards(this.cardGifts);
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

      totalValue = totalValue + (item.product.retailPrice * item.count);
      totalValueDiscount = totalValueDiscount + (item.product.discountPrice * item.count);

    })
    totalValue = this.productService.roundPrice(totalValue);
    totalValueDiscount = this.productService.roundPrice(totalValueDiscount);

    return {
      totalValue: totalValue,
      totalValueDiscount: totalValueDiscount,
    }


  }


  checkCardNumber(number: string): any {

    let result;

    if (number == '111') {
      result = new PromoCode({
        number: '111',
        value: 200.0,
        cardType: 'gift'
      })
    }
    if (number == '333') {
      result = new PromoCode({
        number: '333',
        value: 100.0,
        cardType: 'gift'
      })
    }
    if (number == '222') {
      result = new PromoCode({
        number: '222',
        discountPercent: 50.0,
        cardType: 'promocode'
      })
    }
    return result
  }


  ngOnDestroy() {
    this.saveToStorage()
    this.destroySubject.next();
  }

  ngAfterViewInit(): void {
    console.log("!!!!!", this.giftCard);

  }


}
