export class Order {

  name: string;
  email: string;
  phoneNumber: string;
  deliveryType: DeliveryType;
  orderType:OrderType;
  orderStatus:OrderStatus;
  concentDataProcessing: boolean;
  concentNewsletters: boolean;
  pickPoint: PickPoint;
  deliveryAddress:Address;
  productsInOrder: ProductInOrder;

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
