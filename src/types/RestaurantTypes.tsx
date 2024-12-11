export interface RestaurantType {
    _id: string;
    name: string;
    address: string;
    images: { url: string }[];
    ratings: number;
    numOfReviews: number;
    isVeg: boolean;
  }
  