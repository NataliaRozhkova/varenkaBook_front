import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";
import {Genre} from "../model/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.less']
})
export class ProductInfoComponent implements OnDestroy{

  private destroySubject: Subject<void> = new Subject();

  productType:string = 'book';
  filterName: string = "bookGenres"

  productsOnPage: number = 12;

  filterGenre: Genre | null;

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
  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
