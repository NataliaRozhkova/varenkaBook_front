import {Component, Input, Output} from '@angular/core';
import { Subject} from "rxjs";
import {Router} from "@angular/router";
import {CartItem, CartService} from "../../services/cart.service";
import {Product} from "../../model/product";

@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.less']
})
export class CartItemComponent {

  private destroySubject: Subject<void> = new Subject();

  @Input()
  product: Product;

  @Input()
  count: number;

  // @Output()
  // changeCount: number;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
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

  increaseCount() {
    this.cartService.addToCart(this.product);
  }

   decreaseCount() {
    this.cartService.deleteFromCart(this.product);
  }
  changeCount() {

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
