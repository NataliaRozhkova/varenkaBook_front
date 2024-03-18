import {constructorChecks} from "@angular/cdk/schematics";
import {PromoCode} from "./promo";

export class Order {

  id: number;
  name: string = '';
  email: string = '';
  nif: number;
  phoneNumber: string = '';
  deliveryType: DeliveryType = new DeliveryType();
  orderType: OrderType = new OrderType();
  orderStatus: OrderStatus = new OrderStatus();
  concentDataProcessing: boolean = false;
  concentNewsletters: boolean = false;
  pickPoint: PickPoint | null;
  trackPhoneNumber: string = '';
  nameLatin: string = '';
  postalCode: string = '';
  country: string = '';
  region: string = '';
  city: string = '';
  street: string = '';
  buildingNumber: string = '';
  appartmentNumber: string = '';
  productsInOrder: ProductInOrder[] = [];
  promoCode: PromoCode;
  jointDelivery: boolean = false;
  jointOrder: number;
  initialPrice: number;
  discountPrice: number;
  promoPrice: number;
}
export class DeliveryType {
  type: string = '';
  id: number;
  price: number;

}

export class OrderType {
  type: string = '';
}
export class OrderStatus {
  status: string = '';
}
export class PickPoint {
  name: string = '';
  id: string = '';
  postalCode: string = '';
  country: string = '';
  region: string = '';
  city: string = '';
  street: string = '';
  buildingNumber: string = '';
  appartmentNumber: string = '';

 getString(): string {
    return (this.postalCode ? this.postalCode + ', ': '') +
     (this.country ? this.country + ', ': '') +
      (this.region ? this.region + ', ': '') +
      (this.city ? this.city + ', ': '') +
      (this.street ? this.street + ', ': '') +
      (this.buildingNumber ? this.buildingNumber + ', ': '') +
      (this.appartmentNumber ? this.appartmentNumber + ', ': '')
  }
}

export class ProductInOrder {
  product: ProductID;
  amount: number = 0;
  fromStock: boolean = false;

  constructor(params:any) {
    this.product = params.product;
    this.amount = params.amount;
    this.fromStock = params.fromStock;
  }
}

export class ProductID {
  id: string  = '';
  constructor(id: string) {
    this.id = id;

  }
}
