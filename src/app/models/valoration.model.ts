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
  
   static fromJson(raw: any): Valoration {
    return new Valoration(
      raw.id ?? '',
      raw.title ?? '',
      raw.description ?? '',
      typeof raw.rating === 'number' ? raw.rating : parseFloat(raw.rating) || 0,
      raw.ratedUserId ?? '',
      raw.raterUserId ?? ''
    );
  }
}