import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Subject, switchMap, takeUntil} from "rxjs";
import {CartService} from "../../../services/cart.service";
import {ProductService} from "../../../services/product.service";


@Component({
  selector: 'order-result',
  templateUrl: './order-result.component.html',
  styleUrls: ['./order-result.component.less',
  ]
})
export class OrderResultComponent implements OnDestroy{

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
  ) {
  }

  orderId: number;
  preorderId:number;
  result: string;

  ngOnInit() {

    this.route.paramMap.pipe(
      takeUntil(this.destroySubject),
    ).subscribe((query: any) => {
      this.orderId = query.params?.orderId;
      this.preorderId = query.params?.preorderId;
      this.result = query.params?.result;
      if (this.result == 'success') {
        this.cartService.clearCart();
      } else {
        this.cancelOrder();
      }
    });
  }

  cancelOrder() {

    this.productService.cancelOrder( this.orderId
    ).pipe(
      takeUntil(this.destroySubject),

    ).subscribe();

    if (this.preorderId) {

      this.productService.cancelOrder(this.preorderId).pipe(
        takeUntil(this.destroySubject),

      ).subscribe();
    }

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }





}
