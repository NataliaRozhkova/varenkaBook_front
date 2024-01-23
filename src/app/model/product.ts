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
  genres: Genre[];
  illustrator: string;
  isNew: boolean;
  isPopular: boolean;
  isbn: string;
  language: Language;
  pageAmount: number;
  mainPhoto: string;
  panoramaPhoto: string;
  previewPhoto: string;
  photos: Photo[];
  productType: ProductType;
  publisher: Publisher;
  retailPrice: number;
  shortDescription: string;
  year: string;
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

export class Genre {
  id: string;
  genre: string;
  image: string;
}

export class Photo {
  id: string;
  photo: string;
  productId: string;
}
