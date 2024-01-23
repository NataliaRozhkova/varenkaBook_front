import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {Product} from "../../model/product";
import {MatDialog} from "@angular/material/dialog";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.less']
})
export class CartItemComponent {

  private destroySubject: Subject<void> = new Subject();

  @Input()
  product: Product;

  @ViewChild('dialog') myDialog = {} as TemplateRef<string>;

  private dialogRef: any;

  @Input()
  count: number;


  constructor(
    private cartService: CartService,
    private router: Router,
    public dialog: MatDialog,
    public imageService: ImageService,
  ) {
  }

  ngOnInit() {
    console.log("!!!!!!!!!!", this.product)

  }

  increaseCount() {
    this.cartService.addToCart(this.product);
  }

  decreaseCount(count: number = 1) {

    this.cartService.deleteFromCart(this.product, count);
  }

  changeCount($event: any) {
    if ($event > this.product.countInStock) {
      $event = this.product.countInStock
    }
    this.cartService.setCount(this.product, $event)
  }

  openProductInfo(){
    this.router.navigate(['product-info', this.product.id ])
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
