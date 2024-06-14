import {Component, OnInit, ViewChild } from '@angular/core';
import {ProductPageComponent} from "../product-page/product-page.component";

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.less']
})
export class BooksComponent implements OnInit {

    @ViewChild('products')
    products: ProductPageComponent;

     ngOnInit() {

         let contentElement = document.getElementById('booksMenuItem');
         contentElement?.addEventListener('click',  () => {

            this.products.rejectFilters();

         })

     }

}
