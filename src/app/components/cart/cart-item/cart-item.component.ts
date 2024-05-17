import {Component, Input, OnDestroy, Output, TemplateRef, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {CartService} from "../../../services/cart.service";
import {Product} from "../../../model/product";
import {MatDialog} from "@angular/material/dialog";
import {ImageService} from "../../../services/image.service";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.less']
})
export class CartItemComponent implements OnDestroy{

  private destroySubject: Subject<void> = new Subject();

  @Input()
  product: Product;

  @ViewChild('dialog') myDialog = {} as TemplateRef<string>;

  private dialogRef: any;

  @Input()
  count: number;

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    private router: Router,
    public dialog: MatDialog,
    public imageService: ImageService,
  ) {
  }

  ngOnInit() {
  }

  increaseCount() {
    this.cartService.addToCart(this.product);
  }

  decreaseCount(count: number = 1) {

    this.cartService.deleteFromCart(this.product, count);
  }

  checkCount($event: any): boolean{
    return false
  }

  changeCount($event: any) {

    let countOrder = $event;

    if ($event > this.product.countInStock) {
      countOrder = this.product.countInStock;
      this.count = this.product.countInStock;
    }
    this.cartService.setCount(this.product, countOrder)
  }

  openProductInfo(){
    this.router.navigate(['product-info', this.product.tag ])
  }


  deleteAll() {

    this.dialogRef = this.dialog.open(this.myDialog,
      {
        data: 123, height: '350px', width: '250px',
      });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.cartService.deleteFromCart(this.product, this.count);
      }
    });

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
