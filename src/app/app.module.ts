import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HeaderComponent} from './header/header.component';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProductItemComponent} from "./product-item/product-item.component";
import {ProductsComponent} from "./products/products.component";
import {PageMenuItemComponent} from "./page-menu/page-menu-item/page-menu-item.component";
import {PageMenuComponent} from "./page-menu/page-menu.component";
import {HttpClientModule} from "@angular/common/http";

import {RouterModule, Routes} from "@angular/router";
import {ContactsComponent} from "./contacts/contacts.component";
import {NewsComponent} from "./news/news.component";
import {MainComponent} from "./main/main.component";
import {NgxPaginationModule} from "ngx-pagination";

const appRoutes: Routes = [
  {path: 'contacts', component: ContactsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'main', component: MainComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductItemComponent,
    ProductsComponent,
    PageMenuItemComponent,
    PageMenuComponent,
    ContactsComponent,
    NewsComponent,
    MainComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes, {enableTracing: true}
    ),
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
