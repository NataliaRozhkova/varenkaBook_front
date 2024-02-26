export class PromoCode {
  number: string;
  cardType: 'gift' | 'promocode';
  value: number;
  discountPercent: number;

  constructor(params: any) {
    this.number = params.number;
    this.value = params.value;
    this.discountPercent = params.discountPercent;
    this.cardType = params.cardType;

  }
}


export class  CertificateCard {
  value: number;
  id: string;
  photo: string;
}
