
export class Slide {
  image: string;
  text: string;
  number: number;

  constructor(params: any) {
    this.image = params.image;
    this.text = params.text;
    this.number = params.number;
  }
}

export class News {
  name: string;
  id: string;
  shortDescription: string;
  text: string;
  date: Date;
  photo: string;
}

export class PaymentParameters {
  currency: string;
  success_url: string;
  cancel_url: string;
  email: string;
  items: PaymentItem[] = [];
  certificates: CertificateItem[] = [];
}

export class PaymentItem {
  type: PaymentItemsType;
  id: number;
  quantity: number;
}

export class CertificateItem {
  number: string;

  constructor(number: string) {
    this.number = number
  }
}

export enum PaymentItemsType {
  order ='order',
  certificate = 'certificate'
}

