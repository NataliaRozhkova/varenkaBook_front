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
