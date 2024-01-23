import {EventEmitter, Injectable} from '@angular/core';
import {Product} from "../model/product";
import {StorageService} from "./storage.service";
import {PromoCode} from "../model/promo";

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

  constructor(
    private storageService: StorageService,
  ) {
    this.products = this.storageService.getItem('products', '[]');
    this.productsCount = this.storageService.getItem('productsCount', '0');
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

  getProductCount(id: string): number {
    let productCount: number = 0;
    let product = this.getProducts().find((item) => item.product.id == id);

    if (product) {
      productCount = product.count
    }
    return productCount;
  }

  getProducts() {
    return this.products;
  }

  setPromocode(promocode: PromoCode) {
    this.storageService.setItem(promocode, 'promocode');
  }
  getPromocode( ): PromoCode {
    return this.storageService.getItem( 'promocode', 'null');
  }

  setGiftCards(giftCards: PromoCode[]) {
    this.storageService.setItem(giftCards, 'giftCards');
  }
  getGiftCards( ): PromoCode[] {
    return this.storageService.getItem( 'giftCards', '[]');
  }

  deletePromocodeFromStorage() {
    this.storageService.deleteItem('promocode');
  }
  deleteGiftCardsFromStorage() {
    this.storageService.deleteItem('giftCards');
  }

  clearCart() {
    this.products = [];
    this.cartChange.emit();
    return this.products;
  }

  syncItems() {
    this.cartChange.emit();
    this.storageService.setItem(this.products, 'products');
    this.storageService.setItem(this.productsCount, 'productsCount');
  }
}
