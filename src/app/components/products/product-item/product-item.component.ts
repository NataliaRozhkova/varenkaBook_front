import { Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../model/product";
import {Router} from "@angular/router";
import {ImageService} from "../../../services/image.service";

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.less']
})
export class ProductItemComponent implements  OnInit {

  @Input()
  product: Product;

  productImage: string;

  constructor(
    private router: Router,
    public imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    let imageLink = this.product.previewPhoto ? this.product.previewPhoto : this.product.mainPhoto;
    if (!imageLink && this.product.imageLink) {
      imageLink = this.product.imageLink
    }
    this.productImage = imageLink;
  }

  openInfo($event: Product) {

    this.router.navigate(['product-info', $event.tag])

  }

}
