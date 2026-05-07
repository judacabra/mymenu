export interface User {
    id?: number,
    name: string,
    email: string,
    password?: string,
    username: string,
    id_profile?: number,
    id_headquarter?: number,
    profile_name?: string,
    company_name?: string,
    active: boolean,
}