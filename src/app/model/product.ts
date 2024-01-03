export class Product {

  id: string;
  name: string;
  author: string;
  ageCategory: AgeCategory;
  availability: Availability;
  countInStock: number;
  dataChange: Date;
  dataSave: Date;
  description: string;
  discount: number;
  discountPrice: number;
  format: Format;
  genres: string[];
  illustrator: string;
  isNew: boolean;
  isPopular: boolean;
  isbn: string;
  language: Language;
  pageAmount: number;
  mainPhoto: string;
  panoramaPhoto: string;
  previewPhoto: string;
  photos: string[];
  productType: ProductType;
  publisher: Publisher;
  retailPrice: number;
  shortDescription: string;
  soldAmount: number;


}

export class AgeCategory {
  id: string;
  ageCategory: string;
  constructor(ageCategory: any) {
    this.id = ageCategory.id;
    this.ageCategory = ageCategory.ageCategory;
  }

  }

export class Availability {
  id: string;
  status: string;
}

export class Publisher {
  id: string;
  isMarketplace: boolean;
  name: string;
}

export class Language {
  id: string;
  type: string;
}

export class ProductType {
  id: string;
  type: string;
}

export class Format {
  id: string;
  format: string;
}
