import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Genre} from "../../model/product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductsListComponent} from "../products/products-list.component";
import {ProductFiltersComponent} from "../product-filters/product-filters.component";
import {InformationService} from "../../services/information.service";

@Component({
  selector: 'foreign',
  templateUrl: './foreign.component.html',
  styleUrls: ['./foreign.component.less']
})
export class ForeignComponent implements OnDestroy, OnInit {

  private destroySubject: Subject<void> = new Subject();

  productType: string = 'foreign';

  mainFilterName: string = "иностранные"
  filterName: string = "иностранные"

  productsOnPage: number = 12;

  filterGenre: Genre | null;
  height: string;

  @ViewChild('products')
  products: ProductsListComponent = new ProductsListComponent(this.productService);
  @ViewChild('filters')
  filters: ProductFiltersComponent = new ProductFiltersComponent(this.productService, this.router, this.infoService);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private infoService: InformationService,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.height = window.innerWidth < 600 ? '60vh' : '70vh';

    this.route.queryParams?.pipe(
      takeUntil(this.destroySubject),
    ).subscribe((params: any) => {

        if (params.genre == 'all') {
          this.filterGenre = null;
          this.changeCategory(null)
        }
      }
    );


  }

  changeCategory($event: Genre | null) {

    this.filterGenre = $event
    if (this.products) {
      this.products.genres = $event;
      this.products.change(1);
    }

    if (!$event) {
      this.filterName = this.mainFilterName;
      this.filters.changeFilterName(this.mainFilterName);

    }

    if ($event?.genre) {
      this.filterName = $event?.genre;
      this.filters.changeFilterName($event?.genre);

    }
  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
