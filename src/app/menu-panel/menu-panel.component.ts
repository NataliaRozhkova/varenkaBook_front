import {Component, EventEmitter, Input, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";
import {Genre, Product} from "../model/product";
import {FrontParam} from "../model/service-information";
import {Router} from "@angular/router";
import {CartService} from "../services/cart.service";

@Component({
  selector: 'menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.less']
})
export class MenuPanelComponent {

  private destroySubject: Subject<void> = new Subject();
  productsCount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.productsCount = this.cartService.getCartCount();

  }

  ngOnInit() {

    this.cartService.cartChange.pipe(
        takeUntil(this.destroySubject))
      .subscribe((next) => {
      this.productsCount = this.cartService.getCartCount();
    })
  }

  openCartPage() {
    this.router.navigate(['cart' ])

  }

  ngOnDestroy() {
    this.destroySubject.next();
  }


}
