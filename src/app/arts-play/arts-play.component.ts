import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subject, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";
import {Genre} from "../model/product";
import {ActivatedRoute} from "@angular/router";
import {ProductsListComponent} from "../products/products-list.component";

@Component({
  selector: 'arts-play',
  templateUrl: './arts-play.component.html',
  styleUrls: ['./arts-play.component.less']
})
export class ArtsPlayComponent implements OnDestroy,OnInit  {

  private destroySubject: Subject<void> = new Subject();

  productType: string = 'games';

  filterName: string = "gamesGenres"
  productsOnPage: number = 12;

  filterGenre: Genre | null;
  @ViewChild('products')
  products: ProductsListComponent;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
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
  }


  ngOnDestroy() {
    this.destroySubject.next();
  }

}
