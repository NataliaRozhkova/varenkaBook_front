import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Availability, Genre, Product} from "../../model/product";
import {find, Subject, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.less']
})
export class ProductsListComponent implements OnDestroy, OnInit {

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

  @Input()
  productStatus: string = 'in_stock';

  @Input()
  search: string;

  filters: any = {};
  loading: boolean = true;

  private destroySubject: Subject<void> = new Subject();


  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.products = [];
    this.pageSize = this.productsCountOnPage;

    this.filters.limit = this.productsCountOnPage;
    this.filters.offset = this.offset;
    this.filters.ordering = this.order;
    if (this.productType) {
      this.filters.product_type = this.productType;
    }
    if (this.search) {
      this.filters.search = this.search;
    }
    this.filters.availability = this.productStatus;
    if (this.genres) {
      this.filters.genres = this.genres.id;
    }

    this.change(1);
  }


  change($event: any) {

    this.products = []

    this.filters.offset = ($event - 1) * this.productsCountOnPage + this.offset;

    if (this.genres) {
      this.filters.genres = this.genres.id;
    } else {
      delete this.filters['genres'];
    }

    if (this.search) {
      this.filters.search = this.search;
    }

    setTimeout(() => {
      this.filters.availability = this.availability;
      this.loading = true;

      this.productService.getProducts(this.filters)
        .pipe(
          takeUntil(this.destroySubject),
        )
        .subscribe((res: any) => {
            this.products = res.results;
            this.total = res.count;
            this.page = $event;
            this.loading = false;
          },err => {
          this.loading = false;
          }
        )

    },  0)


  }

  getProductsLength(): number {
    return this.products ? this.products.length : 0;
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
