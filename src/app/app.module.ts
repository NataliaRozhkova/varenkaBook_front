import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HeaderComponent} from './header/header.component';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProductItemComponent} from "./products/product-item/product-item.component";
import {ProductsListComponent} from "./products/products-list.component";
import {PageMenuItemComponent} from "./page-menu/page-menu-item/page-menu-item.component";
import {PageMenuComponent} from "./page-menu/page-menu.component";
import {HttpClientModule} from "@angular/common/http";

import {RouterModule, Routes} from "@angular/router";
import {ContactsComponent} from "./contacts/contacts.component";
import {NewsComponent} from "./news/news.component";
import {MainComponent} from "./main/main.component";
import {NgxPaginationModule} from "ngx-pagination";
import {BooksComponent} from "./books/books.component";
import {ArtsPlayComponent} from "./arts-play/arts-play.component";
import {ProductFiltersComponent} from "./product-filters/product-filters.component";
import {CustomScrollbarComponent} from "./custom-scrollbar/custom-scrollbar.component";
import {ProductInfoComponent} from "./product-info/product-info.component";
import {CartComponent} from "./cart/cart.component";
import {MenuPanelComponent} from "./menu-panel/menu-panel.component";
import {CartItemComponent} from "./cart/cart-item/cart-item.component";
import {DialogComponent} from "./dialog/dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import {MatGridListModule} from "@angular/material/grid-list";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const appRoutes: Routes = [
  {path: 'contacts', component: ContactsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'books', component: BooksComponent},
  {path: 'books/:genre', component: BooksComponent},
  {path: 'arts-play/:genre', component: ArtsPlayComponent},
  {path: 'arts-play', component: ArtsPlayComponent},
  {path: 'foreign', component: BooksComponent},
  {path: 'main', component: MainComponent},
  {path: '', component: MainComponent},
  {path: 'product-info/:id', component: ProductInfoComponent},
  {path: 'cart', component: CartComponent},
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
