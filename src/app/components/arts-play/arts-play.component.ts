import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subject, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Genre} from "../../model/product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductsListComponent} from "../products/products-list.component";
import {ProductFiltersComponent} from "../product-filters/product-filters.component";
import {InformationService} from "../../services/information.service";

@Component({
  selector: 'arts-play',
  templateUrl: './arts-play.component.html',
  styleUrls: ['./arts-play.component.less']
})
export class ArtsPlayComponent implements OnDestroy,OnInit  {

  private destroySubject: Subject<void> = new Subject();

  productType: string = 'games';

  filterName: string = "игры"
  mainFilterName: string = "игры"

  productsOnPage: number = 12;

  filterGenre: Genre | null;
  @ViewChild('products')
  products: ProductsListComponent;
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
