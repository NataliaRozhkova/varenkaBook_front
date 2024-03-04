export class PromoCode {
  number: string;
  amount: number;
  procent: number;
  validity: boolean;
  expiryDate: Date;

  constructor(params: any) {
    this.number = params.number;
    this.amount = params.amount;
    this.procent = params.procent;
    this.validity = params.validity;
    this.expiryDate = params.expiryDate;

  }
}

export class Certificate {
  number: string;
  amount: number;
  used: boolean;
  email: string;


}


export class  CertificateCard {
  value: number;
  id: string;
  photo: string;
}
