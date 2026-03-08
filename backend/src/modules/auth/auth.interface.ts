export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'CUSTOMER' | 'PROVIDER';
    businessName?: string;
    description?: string;
    address?: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}
