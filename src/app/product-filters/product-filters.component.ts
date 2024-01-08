import { Component } from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'arts-play',
  templateUrl: './arts-play.component.html',
  styleUrls: ['./arts-play.component.less']
})
export class ProductFiltersComponent {

  private destroySubject: Subject<void> = new Subject();

  productType:string = 'games';



  constructor(
    private productService: ProductService,
  ) {
  }
  //
  // ngOnInit() {
  //
  //
  // }
  //
  //
  // ngOnDestroy() {
  //   // Unsubscribe from all observables
  //   this.destroySubject.next();
  // }
  //


}
