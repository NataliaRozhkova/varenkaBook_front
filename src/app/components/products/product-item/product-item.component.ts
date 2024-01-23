import {Component, Input} from '@angular/core';
import {Product} from "../../../model/product";
import { CurrencyPipe } from "@angular/common";
import {ProductService} from "../../../services/product.service";
import {Router} from "@angular/router";
import {ImageService} from "../../../services/image.service";

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.less']
})
export class ProductItemComponent {

  @Input()
  product: Product;

  productImage: string;

  constructor(
    private router: Router,
    public imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    this.productImage = this.product.previewPhoto ? this.product.previewPhoto : this.product.mainPhoto;
  }

  openInfo($event: Product){

    this.router.navigate(['product-info', $event.id ])

  }

  }
