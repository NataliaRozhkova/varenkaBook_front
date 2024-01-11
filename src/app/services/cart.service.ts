import {EventEmitter, Injectable} from '@angular/core';
import {Product} from "../model/product";

export interface CartItem {
  product: Product;
  count: number;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {

  products: CartItem[] = [];
  productsCount: number = 0;
  cartChange: EventEmitter<any> = new EventEmitter();

  constructor() {
    sessionStorage.clear();
    this.products = JSON.parse(sessionStorage.getItem('products') || '[]');
    this.productsCount = JSON.parse(sessionStorage.getItem('productsCount') || '0');
  }

  addToCart(product: Product, count: number = 1) {
    let item = this.products.find((pr) => pr.product.id == product.id);
    if (item) {
      item.count += count;
    } else {
      this.products.push({
        product: product,
        count: 1
      });
    }
    this.productsCount += count;
    this.syncItems();
  }

  deleteFromCart(product: Product, count: number = 1) {
    let item = this.products.find((pr) => pr.product.id == product.id);

    if (item && item?.count > 0 && this.productsCount > 0) {
      let index = this.products.indexOf(item)

      if (item.count > count) {
        item.count -= count;
        this.productsCount -= count;

      } else {
        item.count = 0;
        this.products.splice(index, 1);
        this.productsCount = this.productsCount - count > 0 ? this.productsCount - count : 0;
      }

    }
    this.syncItems();

  }

  setCount(product: Product, count: number) {
    let item = this.products.find((pr) => pr.product.id == product.id);
    if (item) {
      item.count = count;
    }
    this.productsCount = 0;
    this.products.forEach((item) => this.productsCount += item.count)
    this.syncItems();
  }

  getCartCount(): number {
    return this.productsCount;
  }

  getProducts() {
    return this.products;
  }

  clearCart() {
    this.products = [];
    this.cartChange.emit();
    return this.products;
  }

  syncItems() {
    this.cartChange.emit();

    sessionStorage.setItem('products', JSON.stringify(this.products));
    sessionStorage.setItem('productsCount', JSON.stringify(this.productsCount));
  }
}
