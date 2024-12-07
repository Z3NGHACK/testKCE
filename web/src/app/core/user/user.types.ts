export interface User {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    roles: Role[];
    branch?: string;
}

export interface Role {
    id: number;
    name: string;
    is_default?: boolean;
}
