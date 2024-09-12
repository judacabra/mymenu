export interface Product {
    id: number,
    name: string,
    description: string,
    id_type: number,
    img: string,
    price: number,
    stock: number,
    recommended?: string,
}
