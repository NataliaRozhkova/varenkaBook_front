import {Component, Input, OnDestroy} from '@angular/core';
import {HttpService} from "../services/http.service";
import {Availability, Product} from "../model/product";
import {Subject, take, takeUntil, lastValueFrom, switchMap, map} from "rxjs";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.less']
})
export class ProductsListComponent implements OnDestroy {

  @Input()
  productsCountOnPage: number = 12;
  @Input()
  productTypeId: number;
  @Input()
  genres:string;
  @Input()
  availability:string = 'in_stock'


  products: Product[];
  pageSize: number;
  page: number = 1;
  total: number = 0;

  productStatuses: Availability[];

  filters: any = {};

  private destroySubject: Subject<void> = new Subject();


  constructor(
    private http: HttpService,
    private productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.pageSize = this.productsCountOnPage;

    this.filters.limit = this.productsCountOnPage;
    this.filters.offset = 0;

    if(this.genres) {
      this.filters.genres = this.genres;
    }
    if (this.productTypeId) {
      this.filters.productType = this.productTypeId;
    }

    this.productService.getAvailabilities().pipe(
      takeUntil(this.destroySubject),
      switchMap((statuses: any) => {
          this.productStatuses = statuses?.results;
          this.filters.availability = this.productStatuses.find(av => av.status == this.availability)?.id
          return this.http.get('api/products/', this.filters)}
        ),
          map((response:any) =>{
            this.products = response?.results;
            this.total = response?.count;


          })

      ).subscribe()


  }

  changePage($event: any) {

    this.filters.offset = ($event - 1) * this.productsCountOnPage


    this.http.get('api/products/',
      this.filters)
      .pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe((res: any) => {
          this.products = res.results;
          this.total = res.count;
          this.page = $event;
        }
      )

  }

  ngOnDestroy() {
    // Unsubscribe from all observables
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
