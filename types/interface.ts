export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "ctv-1" | "ctv-2" | "editor";
}
export interface ICategory {
  _id: string;
  name: string;
}
export interface ITrademark {
  _id: string;
  name: string;
  logo?: string;
}
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  image: string[];
  price: number;
  categoryId: string;
  trademarkId: string;
  other?: string;
}
