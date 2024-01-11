import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Subject, switchMap} from "rxjs";
import {ProductService} from "../services/product.service";
import { Product} from "../model/product";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {CartService} from "../services/cart.service";
import {ImageService} from "../services/image.service";

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.less']
})
export class ProductInfoComponent implements OnDestroy,OnInit  {

  private destroySubject: Subject<void> = new Subject();
  product: Product = new Product();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    public imageService: ImageService,
  ) {
  }

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          return this.productService.getProductInfo(params?.get('id'));
        }
      ),
      map((res: Product) => {
        this.product = res;
      })
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  addToCart(){
    this.cartService.addToCart(this.product)
  }

  deleteFromCart(){
    this.cartService.deleteFromCart(this.product)
  }


}
