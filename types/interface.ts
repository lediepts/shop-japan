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
  alias: string;
}
export interface ITrademark {
  _id: string;
  name: string;
  logo?: string;
}
