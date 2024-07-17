import {
  AfterContentChecked,
  Component,
  EventEmitter,
  HostListener, inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";
import {AgeCategory, Genre} from "../../model/product";
import {ActivatedRoute, Router, ParamMap} from "@angular/router";
import {ProductsListComponent} from "../products/products-list.component";
import {InformationService} from "../../services/information.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FrontParam} from "../../model/service-information";
import {MatSelect} from "@angular/material/select";
import {PagePosition, PageService} from "../../services/page.service";

@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.less'],
  animations: [
    trigger('iconChange', [
      state('initial', style({transform: 'scaleY(-1)'})),
      state('expanded', style({transform: 'scaleY(1)'})),

      transition('initial <=> expanded', animate('0.1s')),
    ]),
  ],

})
export class ProductPageComponent implements OnDestroy, OnInit, AfterContentChecked {

  private destroySubject: Subject<void> = new Subject();

  @Input()
  productType: string;

  @Input()
  mainFilterName: string;

  @Input()
  filterName: string;

  productsOnPage: number = 12;

  @Input()
  showFilters: boolean = false;

  filterGenre: Genre | null;
  height: string;
  categoryState: string = 'initial';
  ageState: string = 'initial';
  sortState: string = 'initial';

  frontParams: FrontParam[] = [];

  allGenres: Genre[] = []

  @ViewChild('products')
  products: ProductsListComponent = new ProductsListComponent(this.productService);

  @ViewChild('selectGenre') selectGenre: MatSelect;
  @ViewChild('selectAge') selectAge: MatSelect;
  @ViewChild('selectSort') selectSort: MatSelect;

  cdr = inject(ChangeDetectorRef);

  filters: string[] = [];


    @Input()
    pageName: string;

  genres: Genre[] = [];
  ageCategories: AgeCategory[] = [];

  sortTypes: any = [
    {name: 'По возрастанию цены', value: 'order_discount_price_euro'},
    {name: 'По убыванию цены', value: '-order_discount_price_euro'},
    {name: 'По названию', value: 'name'},
    {name: 'По автору', value: 'author'},
    {name: 'По популярности', value: '-is_popular'},
    {name: 'По новизне', value: '-is_new'},
  ]


  position: PagePosition;
  content: HTMLElement | null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private infoService: InformationService,
    private router: Router,
    private pageService: PageService,
  ) {
  }

  ngOnInit() {

    this.height = window.innerWidth < 600 ? '60vh' : '70vh';
    this.content = document.getElementById('content');
    this.position = this.pageService.getPosition();

    this.infoService.getFrontParams()
      .pipe(
        takeUntil(this.destroySubject),
        switchMap((res: any) => {
          this.frontParams = res?.results;
          const bookFilters = this.frontParams.find(par => par.name == this.filterName)?.value
          this.filters = [];

          if (bookFilters) {

            let list = bookFilters?.split(',');
            list.forEach((i) => {
              this.filters.push(i.trim());
            })
          }
          return this.productService.getGenres()
        }),
        switchMap((response: any) => {

          this.genres = [];
          this.allGenres = response?.results;
          this.genres = response?.results?.filter((genre: any) => {
            return this.filters.includes(genre.genre)
          });


          return this.productService.getAgeCategories();
        }),
        map((response: any) => {
          this.ageCategories = response?.results;
        })
      ).subscribe(() => {
      this.setPosition();

    })

    this.pageService.pageEvent.subscribe((event) => {

      if (event == 'pagination') {
        this.position.scrollPosition = 0;
      }
    })

  }

  ngAfterContentChecked() {

    if (this.content && this.position.pageName == this.pageName && this.content.scrollHeight >= this.position.pageHeight) {

      this.content.scrollTop = this.position.scrollPosition;
      this.position = new PagePosition({});
        this.cdr.detectChanges();

    }
  }

  setPosition() {

    if (this.content && this.position.pageName == this.pageName) {


      this.selectGenre.value = this.position.genreSelected;

      this.selectAge.value = this.position.ageCategorySelected;
      this.selectSort.value = this.position.sortSelected;
      this.changeFilters();
    }


  }

  change() {
    this.products.genres = this.selectGenre.value;
    this.products.ageCategory = this.selectAge.value;
    this.products.order = this.selectSort.value;
    this.products.change(1);
    this.changeFilters();
  }


  changeFilters() {

    let selectedGenreName = this.genres.find((g) =>
      g.id == this.selectGenre.value
    )?.genre

    let bookFilters = this.frontParams.find(par => par.name == selectedGenreName)?.value

    if (!this.selectGenre.value) {
      bookFilters = this.frontParams.find(par => par.name == 'книги')?.value
    }


    if (bookFilters) {
      this.mainFilterName = bookFilters;
      this.filterName = this.selectGenre.value;
      this.filters = [];

      if (bookFilters) {

        let list = bookFilters?.split(',');
        list.forEach((i) => {
          this.filters.push(i.trim());
        })

        this.genres = this.allGenres.filter((genre: any) => {

          return this.filters.includes(genre.genre)
        });
      }
    }


  }

  rejectFilters() {
    this.selectGenre.value = '';
    this.selectAge.value = '';
     this.selectSort.value = '';
    this.change() ;


  }


  ngOnDestroy() {
    this.destroySubject.next();

    this.pageService.setPagePosition({
      pageName: this.productType,
      pagination: this.products.page,
      scrollPosition: this.content?.scrollTop,
      ageCategorySelected: this.selectAge?.value,
      genreSelected: this.selectGenre?.value,
      sortSelected: this.selectSort?.value,
      pageHeight: this.content ? this.content.scrollHeight : 0
    })

  }


}
