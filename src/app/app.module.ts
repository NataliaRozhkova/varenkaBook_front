import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HeaderComponent} from './components/header/header.component';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProductItemComponent} from "./components/products/product-item/product-item.component";
import {ProductsListComponent} from "./components/products/products-list.component";
import {PageMenuItemComponent} from "./components/page-menu/page-menu-item/page-menu-item.component";
import {PageMenuComponent} from "./components/page-menu/page-menu.component";
import {HttpClientModule} from "@angular/common/http";

import {RouterModule, Routes} from "@angular/router";
import {ContactsComponent} from "./components/contacts/contacts.component";
import {NewsComponent} from "./components/news/news.component";
import {MainComponent} from "./components/main/main.component";
import {NgxPaginationModule} from "ngx-pagination";
import {BooksComponent} from "./components/books/books.component";
import {ArtsPlayComponent} from "./components/arts-play/arts-play.component";
import {ProductFiltersComponent} from "./components/product-filters/product-filters.component";
import {CustomScrollbarComponent} from "./components/custom-scrollbar/custom-scrollbar.component";
import {ProductInfoComponent} from "./components/product-info/product-info.component";
import {CartComponent} from "./components/cart/cart.component";
import {MenuPanelComponent} from "./components/menu-panel/menu-panel.component";
import {CartItemComponent} from "./components/cart/cart-item/cart-item.component";
import {DialogComponent} from "./components/dialog/dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import {MatGridListModule} from "@angular/material/grid-list";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OrderComponent} from "./components/order/order.component";
import {MatInputModule} from "@angular/material/input";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SliderComponent} from "./components/slider/slider.component";
import {ImageComponent} from "./components/image/image.component";
import {MatStepperModule} from "@angular/material/stepper";
import { PhoneMaskDirective} from "./directives/phone-mask.directive";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {NewsItemComponent} from "./components/news/news-item/news-item.component";
import {NewsInfoComponent} from "./components/news/news-info/news-info.component";
import {SubscribeComponent} from "./components/sibscribe/subscribe.component";
import {FindPanelComponent} from "./components/find-panel/find-panel.component";

const appRoutes: Routes = [
  {path: 'contacts', component: ContactsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'news-info/:id', component: NewsInfoComponent},
  {path: 'books', component: BooksComponent},
  {path: 'books/:genre', component: BooksComponent},
  {path: 'arts-play/:genre', component: ArtsPlayComponent},
  {path: 'arts-play', component: ArtsPlayComponent},
  {path: 'foreign', component: BooksComponent},
  {path: 'main', component: MainComponent},
  {path: '', component: MainComponent},
  {path: 'product-info/:id', component: ProductInfoComponent},
  {path: 'cart', component: CartComponent},
  {path: 'order/:id', component: OrderComponent},
  {path: 'order', component: OrderComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductItemComponent,
    ProductsListComponent,
    PageMenuItemComponent,
    PageMenuComponent,
    ContactsComponent,
    NewsComponent,
    MainComponent,
    BooksComponent,
    ArtsPlayComponent,
    ProductFiltersComponent,
    CustomScrollbarComponent,
    ProductInfoComponent,
    CartComponent,
    MenuPanelComponent,
    CartItemComponent,
    DialogComponent,
    OrderComponent,
    SliderComponent,
    ImageComponent,
    PhoneMaskDirective,
    NewsItemComponent,
    NewsInfoComponent,
    SubscribeComponent,
    FindPanelComponent,
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes, {enableTracing: false}
    ),
    NgxPaginationModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    CdkStepperModule,


  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
