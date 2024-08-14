export class PartialWishDto {
  id: number;

  name: string;

  link: string;

  image: string;

  price: number;

  raised: number;

  copied: number;

  description: string;

  createdAt: string;

  updatedAt: string;

  constructor(
    id: number,
    name: string,
    link: string,
    image: string,
    price: number,
    raised: number,
    copied: number,
    description: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.image = image;
    this.price = price;
    this.raised = raised;
    this.copied = copied;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
