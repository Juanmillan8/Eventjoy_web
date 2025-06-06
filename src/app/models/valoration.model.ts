export class Valoration {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratedUserId: string;
  raterUserId: string;

  constructor(
    id: string,
    title: string,
    description: string,
    rating: number,
    ratedUserId: string,
    raterUserId: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.rating = rating;
    this.ratedUserId = ratedUserId;
    this.raterUserId = raterUserId;
  }

}