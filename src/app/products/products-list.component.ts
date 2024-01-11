import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {Availability, Genre, Product} from "../model/product";
import {Subject, takeUntil, switchMap, map, } from "rxjs";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.less']
})
export class ProductsListComponent implements OnDestroy,OnInit  {

  @Input()
  productsCountOnPage: number = 12;
  @Input()
  productType: string;
  @Input()
  genres: Genre | null;
  @Input()
  availability: string = 'in_stock'


  products: Product[] = [];
  pageSize: number;
  page: number = 1;
  total: number = 0;
  order: string = '-priority,-is_new,-is_popular'

  @Input()
  offset: number = 0;

  @Input()
  showPagination: boolean = true;

  productStatuses: Availability[];

  filters: any = {};

  private destroySubject: Subject<void> = new Subject();


  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.products  = [];
    this.pageSize = this.productsCountOnPage;

    this.filters.limit = this.productsCountOnPage;
    this.filters.offset = this.offset;
    this.filters.ordering = this.order;

    if (this.genres) {
      this.filters.genres = this.genres.id;
    }

    this.productService.getProductTypes().pipe(
      takeUntil(this.destroySubject),
      switchMap((types: any) => {
        this.filters.product_type = types?.results?.find((av: any) => av.type == this.productType)?.id;

        return this.productService.getAvailabilities()
      }),
      map((response: any) => {
        this.productStatuses = response?.results;
        this.filters.availability = this.productStatuses.find(av => av.status == this.availability)?.id

        this.change(1);
      })
    ).subscribe()
  }


  change($event: any) {
    this.products  = []

    this.filters.offset = ($event - 1) * this.productsCountOnPage + this.offset;

    if (this.genres) {
      this.filters.genres = this.genres.id;
    } else {
      delete this.filters['genres'];
    }

    this.productService.getProducts(this.filters)
      .pipe(
        takeUntil(this.destroySubject),
      )
      .subscribe((res: any) => {
        this.products = res.results;
          this.total = res.count;
          this.page = $event;
        }
      )
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  upPage(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
