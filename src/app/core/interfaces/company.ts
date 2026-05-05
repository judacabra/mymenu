export interface Company {
    id?: number,
    name: string,
    nit: number,
    img?: string,
    active: boolean,
    description: string,
}
export interface CompaniesInfo {
    total: number,
    active: number,
    inactive: number,
    porcent_active: number,
    porcent_inactive: number
}
