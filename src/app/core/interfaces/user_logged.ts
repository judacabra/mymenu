import { Permission } from './permission'

export interface UserLogged {
    id: number,
    name: string,
    email: string,
    profile_name: string,
    company_name: string,
    permissions: Permission[],
}