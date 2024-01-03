import {Component, Input} from '@angular/core';
import {Product} from "../model/product";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.less']
})
export class ProductItemComponent {

  @Input()
  product: Product;

  productInfoLink: string;
  productImage: string;

  ngOnInit(): void {

    this.productImage = this.product.previewPhoto ? this.product.previewPhoto : this.product.mainPhoto;


  }

  }
