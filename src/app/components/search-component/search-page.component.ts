import {ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {Genre, Product} from "../../model/product";
import {ProductsListComponent} from "../products/products-list.component";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.less'],

})
export class SearchPageComponent implements OnInit, OnDestroy {


  private destroySubject: Subject<void> = new Subject();

  productsOnPage: number = 12;

  searchInStock: boolean = true;

  @ViewChild('productsInStock')
  productsInStock: ProductsListComponent;
  @ViewChild('productsToOrder')
  productsToOrder: ProductsListComponent;

  selectedTab: number = 0;

  availability: string = 'in_stock'
  search: string;
  cdr = inject(ChangeDetectorRef);


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParams?.pipe(
      takeUntil(this.destroySubject),
    ).subscribe((params: any) => {
      this.search = params.query;
    });
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  find( ) {

    console.log("************ selectedTab", this.selectedTab)

      const status = this.selectedTab == 0 ? 'in_stock' : 'available_to_order';

      this.availability = status;
      // this.products.availability = status;

    this.selectedTab == 0 ?  this.productsInStock.change(0) : this.productsToOrder.change(0);



  }
}
