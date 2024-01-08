import {Component, EventEmitter, Input, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {CartItem, CartService} from "../services/cart.service";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent {

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


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
