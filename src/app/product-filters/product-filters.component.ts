import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../services/product.service";
import {Genre} from "../model/product";
import {FrontParam} from "../model/service-information";
import {Router} from "@angular/router";
import {InformationService} from "../services/information.service";

@Component({
  selector: 'product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.less']
})
export class ProductFiltersComponent implements OnDestroy,OnInit {

  private destroySubject: Subject<void> = new Subject();

  @Input()
  filterName: string;

  genres: Genre[];
  genresList: string[] = [];
  @Output()
  selectedGenre = new EventEmitter<Genre>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private infoService: InformationService,
  ) {
  }

  ngOnInit() {

    this.infoService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
      switchMap((res: any) => {
        const frontParams: FrontParam[] = res?.results;
        const bookFilters = frontParams.find(par => par.name == this.filterName)?.value

        if (bookFilters) {
          let list = bookFilters?.replace(" ", "").split(',');
          list.forEach((i) => {
            this.genresList.push(i.trim());
          })
        }
        return this.productService.getGenres()
      }),
      map((response: any) => {

        this.genres = response?.results?.filter((genre: any) => {
          return this.genresList.includes(genre.genre)
        });
      })
    ).subscribe()
  }


  chooseGenre($event: Genre) {

    this.selectedGenre.emit($event);
    this.router.navigate([], {queryParams: {genre: $event.genre}})
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }


}
