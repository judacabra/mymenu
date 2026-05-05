export interface Product {
    id?: number,
    name: string,
    description: string,
    id_type: number,
    recommended: string,
    price: number,
    stock: number,
    status?: boolean,
    img?: string,
    date?: string,
    id_company: number,
}
