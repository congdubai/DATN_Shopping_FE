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
        age?: number;
        address?: string;
        avatar?: string;
        phone?: number;
        gender?: string;
    }
}
export interface IGetAccount extends Omit<IAccount, "access_token"> { }


export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    age?: number;
    gender: string;
    phone?: number;
    address?: string;
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
    updatedBy?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProduct {
    id?: string;
    name: string;
    price?: number;
    minPrice?: number;
    image: string;
    detailDesc?: string;
    shortDesc?: string;
    createdAt?: string;
    updatedAt?: string;
    category?: {
        id: string;
        name: string;
    };
    avgRating?: number;
}
export interface ICategory {
    id?: string;
    name: string;
    image: string;
    path?: string;
    gender?: string;
    description: string;
    createdBy?: string;
    updatedBy?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface IColor {
    id?: string;
    name: string;
    description: string;
    hexCode?: string;
    createdBy?: string;
    updatedBy?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISize {
    id?: string;
    name: string;
    description: string;
    createdBy?: string;
    updatedBy?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProductDetail {
    id?: string;
    imageDetail: string;
    quantity: number;
    product?: {
        id: string;
        name: string;
        price?: number;
        category?: {
            id: string;
            name: string;
        }
        detailDesc?: string;
        shortDesc?: string;
    }
    size?: {
        id: string;
        name: string;
    }
    color?: {
        id: string;
        name: string;
        hexCode?: string;
    }
    createdBy?: string;
    updatedBy?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}
export interface ICartItem {
    productId: string;
    colorId: string;
    colorName: string;
    sizeId: string;
    sizeName: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    id?: number;
}

export interface IOrder {
    id?: string;
    user?: { id: string };
    reviews?: { id: string };
    status: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    totalPrice: number;
    orderDate?: string;
    paymentMethod: string;
    orderDetails?: { id: string };
    discount?: { id: string };
}

export interface IOrderDetail {
    id?: string;
    order?: { id: string, orderDate?: string };
    productDetail?: { id: string, product?: { id: string, name: string } };
    quantity: number;
    color: string;
    size: string;
    price: number;
}

export interface IHistory {
    id?: string;
    orderId?: string;
    productId?: string;
    userId?: string;
    name: string;
    image: string;
    size: string;
    color: string;
    quantity: number;
    status: string;
    price: number;
    rating: boolean;
}

export interface IReview {
    id?: string;
    user?: { id: string };
    product?: { id: string };
    order?: { id: string };
    rating: number;
    comment: string;
    userName?: string,
    avatar?: string;
    createdAt?: string;
}

export interface ITopProduct {
    productId?: string;
    productName: string;
    productImage: string
    totalQuantitySold: number;
    productPrice: number;
    averageRating: number;
}
export interface IMessage {
    id?: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface ICategorySeller {
    category: string;
    value: number;
}

export interface ITopSeller {
    name: string;
    email: string;
    phone: string;
    address: string;
    totalQuantity: number;
    totalSpent: number;
}

export interface ISaleSummary {
    date: string;
    country: string;
    value: number;
}

export interface IDiscount {
    id?: string;
    code: string;
    discountPercent: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    description: string;
    quantity: number;
}

export interface IOrderProfitDTO {
    customerName: string;
    quantity: number;
    totalPrice: number;
    minPrice: number;
    profit: number;
    orderDate: string;
    phone: string;
}