import {constructorChecks} from "@angular/cdk/schematics";

export class Order {

  name: string;
  email: string;
  phoneNumber: string;
  deliveryType: DeliveryType = new DeliveryType();
  orderType:OrderType = new OrderType();
  orderStatus:OrderStatus = new OrderStatus();
  concentDataProcessing: boolean = false;
  concentNewsletters: boolean = false;
  pickPoint: PickPoint = new PickPoint();
  deliveryAddress:Address = new Address();
  productsInOrder: ProductInOrder = new ProductInOrder();

}
export class DeliveryType {
  type: string;
}

export class OrderType {
  type: string;
}
export class OrderStatus {
  status: string;
}
export class PickPoint {
  name: string;
  address: Address;
}
export class Address {
  postalCode: string;
  country: string;
  region: string;
  city: string;
  street: string;
  buildingNumber: string;
  appartmentNumber: string;
}
export class ProductInOrder {
  product:ProductID;
  amount: number;
  fromStock: boolean;
}

export class ProductID {
  id: string;
}
