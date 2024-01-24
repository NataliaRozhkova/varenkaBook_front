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
