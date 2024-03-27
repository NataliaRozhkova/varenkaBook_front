import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {CartService} from "../../../services/cart.service";
import {ProductService} from "../../../services/product.service";


@Component({
  selector: 'order-result',
  templateUrl: './order-result.component.html',
  styleUrls: ['./order-result.component.less',
  ]
})
export class OrderResultComponent implements OnDestroy {

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
  ) {
  }

  result: string;
  orderNumbers: string[];

  ngOnInit() {

    this.route.paramMap.pipe(
      takeUntil(this.destroySubject),
    ).subscribe((query: any) => {

      let orders = query.params?.orders?.toString()?.replaceAll(":", " ")?.trim()
      this.orderNumbers = orders?.split(" ")
      this.result = query.params?.result;
      if (this.result == 'success') {
        this.cartService.clearCart();
      } else {
        this.cancelOrder();
      }
    });
  }

  cancelOrder() {

    this.orderNumbers.forEach((ord) => {
      this.productService.cancelOrder(ord).pipe(
        takeUntil(this.destroySubject),
      ).subscribe();
    })

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }
}
