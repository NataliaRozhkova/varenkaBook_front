import { Component } from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.less']
})
export class ArtsPlayComponent {

  private destroySubject: Subject<void> = new Subject();

  productType:string = 'books';
  productTypeId:number;



  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit() {


    this.productService.getProductTypes().pipe(
      takeUntil(this.destroySubject),
      map((response:any) => {

        this.productTypeId = response.result?.find((av:any) => av.type == this.productType)?.id
      })
    ).subscribe()


  }


  ngOnDestroy() {
    // Unsubscribe from all observables
    this.destroySubject.next();
  }



}
