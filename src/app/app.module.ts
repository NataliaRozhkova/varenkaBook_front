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
import {PhoneMaskDirective} from "./directives/phone-mask.directive";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {NewsItemComponent} from "./components/news/news-item/news-item.component";
import {NewsInfoComponent} from "./components/news/news-info/news-info.component";
import {SubscribeComponent} from "./components/subscribe/subscribe.component";
import {SearchPanelComponent} from "./components/search-panel/search-panel.component";
import {SearchPageComponent} from "./components/search-component/search-page.component";
import { MatSnackBarModule} from "@angular/material/snack-bar";
import {UnsubscribeComponent} from "./components/unsibscribe/unsubscribe.component";
import {MatSelectModule} from "@angular/material/select";
import {FooterComponent} from "./footer/footer.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PendingChangesGuard} from "./directives/guard";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ForeignComponent} from "./components/foreign/foreign.component";
import {ProductPageComponent} from "./components/product-page/product-page.component";
import {CertificateListComponent} from "./components/certificate-list/certificate-list.component";
import {CertificateItemComponent} from "./components/certificate-list/certificate-item/certificate-item.component";
import {CertificateComponent} from "./components/certificate/certificate.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {NgxStripeModule, StripeService} from "ngx-stripe";
import {environment} from "../environments/environment";
import {MatRadioModule} from "@angular/material/radio";
import {OrderResultComponent} from "./components/order/order-result/order-result.component";

const appRoutes: Routes = [
  {path: 'contacts', component: ContactsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'news-info/:id', component: NewsInfoComponent},
  {path: 'books', component: BooksComponent},
  {path: 'books/:genre', component: BooksComponent},
  {path: 'arts-play/:genre', component: ArtsPlayComponent},
  {path: 'arts-play', component: ArtsPlayComponent},
  {path: 'foreign', component: ForeignComponent},
  {path: 'main', component: MainComponent},
  {path: '', component: MainComponent},
  {path: 'product-info/:id', component: ProductInfoComponent},
  {path: 'cart', component: CartComponent},
  {path: 'order/:id', component: OrderComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'order', component: OrderComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'search', component: SearchPageComponent},
  {path: 'unsubscribe', component: UnsubscribeComponent},
  {path: 'certificate-info/:id', component: CertificateComponent},
  {path: 'order-result/:result/:orderId', component: OrderResultComponent},
  {path: 'order-result/:result/:orderId/:preorderId', component: OrderResultComponent},
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
    SearchPanelComponent,
    SearchPageComponent,
    UnsubscribeComponent,
    FooterComponent,
    ForeignComponent,
    ProductPageComponent,
    CertificateListComponent,
    CertificateItemComponent,
    CertificateComponent,
    PaymentComponent,
    OrderResultComponent
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
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    NgxStripeModule.forRoot(environment.stripe.publicKey),
    MatRadioModule,

  ],
  providers: [PendingChangesGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
