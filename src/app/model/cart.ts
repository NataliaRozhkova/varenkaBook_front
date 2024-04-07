export class OrdersPriceValues {
  usualOrder: OrderPriceValue;
  preorder: OrderPriceValue;
  certificatesOrder: OrderPriceValue;

  overalFullPrice: number;
  overalDiscountPrice: number;
  overalPromoPrice: number;
  overalToPay: number;

}

export class OrderPriceValue {
  fullPrice: number;
  discountPrice: number;
  promoPrice: number;
  toPay: number;
}

export class CartRequest {
  promoCode: CartCodeItem;
  certificates: CartCodeItem[] = [];

  products: CartProductItem[] = [];
  certificatesInCart: CartCertificateItem[] = [];

}


export class CartCodeItem {
  number: string | null;

  constructor(number: any) {
    this.number = number;
  }
}


export class CartProductItem {
  product: string;
  amount: number;

  constructor(product: string, amount: number) {
    this.product = product;
    this.amount = amount;
  }
}

export class CartCertificateItem {
  certificate: string;
  amount: number;

  constructor(certificate: string, amount: number) {
    this.certificate = certificate;
    this.amount = amount;
  }
}



