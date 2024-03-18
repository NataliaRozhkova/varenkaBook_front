import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";
import {AgeCategory, Genre} from "../../model/product";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductsListComponent} from "../products/products-list.component";
import {InformationService} from "../../services/information.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FrontParam} from "../../model/service-information";
import {MatSelect} from "@angular/material/select";

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
export class ProductPageComponent implements OnDestroy, OnInit {

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

  @ViewChild('products')
  products: ProductsListComponent = new ProductsListComponent(this.productService);

  @ViewChild('selectGenre') selectGenre: MatSelect;
  @ViewChild('selectAge') selectAge: MatSelect;
  @ViewChild('selectSort') selectSort: MatSelect;

  filters: string[] = [];

  genres: Genre[] = [];
  ageCategories: AgeCategory[] = [];

  sortTypes: any = [
    {name: 'По возрастанию цены', value: ''},
    {name: 'По Убыванию цены', value: ''},
    {name: 'По названию', value: 'name'},
    {name: 'По автору', value: 'author'},
    {name: 'По популярности', value: '-is_popular'},
    {name: 'По новизне', value: '-is_new'},
  ]


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private infoService: InformationService,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.height = window.innerWidth < 600 ? '60vh' : '70vh';

    this.infoService.getFrontParams()
      .pipe(
      takeUntil(this.destroySubject),
      switchMap((res: any) => {
        const frontParams: FrontParam[] = res?.results;
        const bookFilters = frontParams.find(par => par.name == this.filterName)?.value
        this.filters = [];

        if (bookFilters) {

          let list = bookFilters?.replace(" ", "").split(',');
          list.forEach((i) => {
            this.filters.push(i.trim());
          })
        }
        return this.productService.getGenres()
      }),
        switchMap((response: any) => {
        this.genres = [];
        this.genres = response?.results?.filter((genre: any) => {
          return this.filters.includes(genre.genre)
        });
        return this.productService.getAgeCategories();
      }),
        map((response: any) => {
          this.ageCategories = response?.results;
        })

    ).subscribe()


  }

  change() {
    this.products.genres = this.selectGenre.value;
    this.products.ageCategory = this.selectAge.value;
    this.products.order = this.selectSort.value;
    this.products.change(1);
  }




  ngOnDestroy() {
    this.destroySubject.next();
  }


}
