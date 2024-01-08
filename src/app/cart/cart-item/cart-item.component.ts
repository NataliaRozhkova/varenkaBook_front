import {Component, EventEmitter, Input, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";
import {Genre, Product} from "../model/product";
import {FrontParam} from "../model/service-information";
import {Router} from "@angular/router";
import {CartItem, CartService} from "../services/cart.service";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartItemComponent {

  private destroySubject: Subject<void> = new Subject();
  products: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.products = this.cartService.getProducts();

  }

  ngOnInit() {



    // this.productService.getFrontParams().pipe(
    //   takeUntil(this.destroySubject),
    //   switchMap((res: any) => {
    //     const frontParams: FrontParam[] = res?.results;
    //     const bookFilters = frontParams.find(par => par.name == this.filterName)?.value
    //
    //     if (bookFilters) {
    //       let list = bookFilters?.replace(" ", "").split(',');
    //       list.forEach((i) => {
    //         this.genresList.push(i.trim());
    //       })
    //     }
    //     return this.productService.getGenres()
    //   }),
    //   map((response: any) => {
    //
    //     this.genres = response?.results?.filter((genre: any) => {
    //       return this.genresList.includes(genre.genre)
    //     });
    //   })
    // ).subscribe()
  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
