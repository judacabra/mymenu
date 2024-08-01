import { Product } from "./product";

export interface TypeFood {
    id?: number,
    name: string,
    url?: string,
    products: Array<Product>,
}
