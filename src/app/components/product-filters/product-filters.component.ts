import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Genre} from "../../model/product";
import {FrontParam} from "../../model/service-information";
import {Router} from "@angular/router";
import {InformationService} from "../../services/information.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.less'],
  animations: [
    trigger('iconChange', [
      state('initial', style({transform: 'scaleY(1)' })),
      state('expanded', style({transform: 'scaleY(-1)'})),

      transition('initial <=> expanded', animate('0.1s')),
    ]),

  ],
})
export class ProductFiltersComponent implements OnDestroy, OnInit {

  private destroySubject: Subject<void> = new Subject();

  @Input()
  filterName: string;

  genres: Genre[];
  genresList: string[] = [];
  @Output()
  selectedGenre = new EventEmitter<Genre>();

  showDroppedList: boolean = false;
  state: string = 'initial';

  constructor(
    private productService: ProductService,
    private router: Router,
    private infoService: InformationService,
  ) {
  }

  ngOnInit() {
    this.showDroppedList = window.innerWidth <= 600;

    this.changeFilterName(this.filterName);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showDroppedList = event.target.innerWidth <= 550;

  }

  changeFilterName(newFilter: string) {
    this.filterName = newFilter;

    this.infoService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
      switchMap((res: any) => {
        const frontParams: FrontParam[] = res?.results;
        const bookFilters = frontParams.find(par => par.name == this.filterName)?.value
        console.log("** ** * ** ", bookFilters)
        this.genresList = [];

        if (bookFilters) {

          let list = bookFilters?.replace(" ", "").split(',');
          console.log("** ** * ** list", list)
          list.forEach((i) => {
            this.genresList.push(i.trim());
          })
          console.log("** ** * **  this.genresList",  this.genresList)

        }
        return this.productService.getGenres()
      }),
      map((response: any) => {
        this.genres = [];
        console.log("** ** * **  this.response?.results",  response?.results)
        console.log("** ** * **  this.this.genresList",  this.genresList)



        this.genres = response?.results?.filter((genre: any) => {
          return this.genresList.includes(genre.genre)
        });
        console.log("** ** * **  this.genres",  this.genres)

      })
    ).subscribe()
  }

  showList(showed: boolean) {
    this.state = showed ? 'expanded' : 'initial'

  }


  chooseGenre($event: Genre) {

    this.selectedGenre.emit($event);
    this.router.navigate([], {queryParams: {genre: $event.genre}})
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }


}
