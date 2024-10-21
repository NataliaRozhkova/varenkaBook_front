import { Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../model/product";
import {Router} from "@angular/router";
import {ImageService} from "../../../services/image.service";
import {CartService} from "../../../services/cart.service";
import {PageService} from "../../../services/page.service";

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.less']
})
export class ProductItemComponent implements  OnInit {

  @Input()
  product: Product;

  productImage: string;
  countInCart = 0;
  openInfoBoolean: boolean = false;

  constructor(
    private router: Router,
    public imageService: ImageService,
    private cartService: CartService,
    private pageService: PageService

  ) {
  }

  ngOnInit(): void {
    let imageLink = this.product.previewPhoto ? this.product.previewPhoto : this.product.mainPhoto;
    if (!imageLink && this.product.imageLink) {
      imageLink = this.product.imageLink
    }
    this.productImage = imageLink;
            this.countInCart = this.cartService.getProductCount(this.product.id);

  }

  openInfo($event: Product) {

    if (this.openInfoBoolean) {

    this.router.navigate(['product-info', $event.tag])
} else {
this.openInfoBoolean = true;
}
  }

  addToCart() {
  this.openInfoBoolean = false;
    this.cartService.addToCart(this.product);
    this.countInCart += 1;
    let position = this.pageService.getPosition();

    let content: HTMLElement | null = document.getElementById('content');

    position.scrollPosition = content?.scrollTop || 0;
    this.pageService.setPagePosition(position);
  }

}
