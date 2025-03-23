export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IAccount {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
        }
    }
}
export interface IGetAccount extends Omit<IAccount, "access_token"> { }


export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    age: number;
    gender: string;
    address: string;
    role?: {
        id: string;
        name: string;
    }
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRole {
    id?: string;
    name: string;
    description: string;
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProduct {
    id?: string;
    name: string;
    price: number;
    image: string;
    detailDesc: string;
    shortDesc: string;
    createdAt?: string;
    updatedAt?: string;
    category?: {
        id: string;
        name: string;
    }
}
export interface ICategory {
    id?: string;
    name: string;
    image: string;
    description: string;
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IColor {
    id?: string;
    name: string;
    description: string;
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISize {
    id?: string;
    name: string;
    description: string;
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}