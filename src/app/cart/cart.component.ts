import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {CartItem, CartService} from "../services/cart.service";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnDestroy,OnInit {

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];
  productsCount: number;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.productsCount = this.cartService.getCartCount();
    this.products = this.cartService.getProducts();

  }

  ngOnInit() {

    this.cartService.cartChange.pipe(
      takeUntil(this.destroySubject))
      .subscribe((next) => {
        this.productsCount = this.cartService.getCartCount();
      })



  }

  continueShopping() {
    this.router.navigate(['books'])
  }

  createOrder() {
    this.router.navigate(['order']);
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }


}
