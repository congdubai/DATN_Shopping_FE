import { IAccount, IBackendRes, ICartItem, ICategory, IColor, IGetAccount, IModelPaginate, IProduct, IProductDetail, IRole, ISize, IUser } from "@/types/backend";
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
/**
 *
Module User
 */
export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}
export const callCreateUser = (email: string, name: string, password: string, avatar: string, age: number, gender: string, address: string, role: IRole) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { email, name, password, avatar, age, gender, address, role });
}
export const callUpdateUser = (id: string, name: string, avatar: string, age: number, gender: string, address: string, role: IRole) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users`, { id, name, avatar, age, gender, address, role });
}
export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}


/**
 * 
Module Role
 */
export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role });
}
export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role });
}
export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}
export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
 Module product
 */
export const callFetchProduct = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products?${query}`);
}
export const callCreateProduct = (name: string, price: number, image: string, detailDesc: string, shortDesc: string, category: ICategory) => {
    return axios.post<IBackendRes<IProduct>>('/api/v1/products', { name, price, image, detailDesc, shortDesc, category });
}
export const callUpdateProduct = (id: string, name: string, price: number, image: string, detailDesc: string, shortDesc: string, category: ICategory) => {
    return axios.put<IBackendRes<IProduct>>(`/api/v1/products`, { id, name, price, image, detailDesc, shortDesc, category });
}
export const callDeleteProduct = (id: string) => {
    return axios.delete<IBackendRes<IProduct>>(`/api/v1/products/${id}`);
}

/**
 * 
 Module category
 */
export const callFetchCategory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(`/api/v1/categories?${query}`);
}
export const callCreateCategory = (name: string, image: string, description: string) => {
    return axios.post<IBackendRes<ICategory>>('/api/v1/categories', { name, image, description });
}
export const callUpdateCategory = (id: string, name: string, image: string, description: string) => {
    return axios.put<IBackendRes<ICategory>>(`/api/v1/categories`, { id, name, image, description });
}
export const callDeleteCategory = (id: string) => {
    return axios.delete<IBackendRes<ICategory>>(`/api/v1/categories/${id}`);
}

/**
 * 
Module Color
 */
export const callFetchColor = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IColor>>>(`/api/v1/colors?${query}`);
}
export const callCreateColor = (color: IColor) => {
    return axios.post<IBackendRes<IColor>>('/api/v1/colors', { ...color });
}
export const callUpdateColor = (color: IColor, id: string) => {
    return axios.put<IBackendRes<IColor>>(`/api/v1/colors`, { id, ...color });
}
export const callDeleteColor = (id: string) => {
    return axios.delete<IBackendRes<IColor>>(`/api/v1/colors/${id}`);
}


/**
 * 
Module Size
 */
export const callFetchSize = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IColor>>>(`/api/v1/sizes?${query}`);
}
export const callCreateSize = (size: ISize) => {
    return axios.post<IBackendRes<IColor>>('/api/v1/sizes', { ...size });
}
export const callUpdateSize = (size: ISize, id: string) => {
    return axios.put<IBackendRes<ISize>>(`/api/v1/sizes`, { id, ...size });
}
export const callDeleteSize = (id: string) => {
    return axios.delete<IBackendRes<ISize>>(`/api/v1/sizes/${id}`);
}


/**
 * 
Module Product Detail
 */
export const callFetchProductDetail = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProductDetail>>>(`/api/v1/productDetails?${query}`);
}
export const callCreateProductDetail = (imageDetail: string, quantity: number, product: IProduct, color: IColor, size: ISize) => {
    return axios.post<IBackendRes<IProductDetail>>('/api/v1/productDetails', { imageDetail, quantity, product, color, size });
}
export const callUpdateProductDetail = (id: string, imageDetail: string, quantity: number, product: IProduct, color: IColor, size: ISize) => {
    return axios.put<IBackendRes<IProductDetail>>(`/api/v1/productDetails`, { id, imageDetail, quantity, product, color, size });
}
export const callDeleteProductDetail = (id: string) => {
    return axios.delete<IBackendRes<IProductDetail>>(`/api/v1/productDetails/${id}`);
}
export const callFetchProductDetailById = (id: string) => {
    return axios.get<IBackendRes<IProductDetail>>(`/api/v1/productDetails/${id}`);
}
export const callFetchProductDetailByColor = (productId: string, colorId: string) => {
    return axios.get<string>(
        `/api/v1/productDetailByColor/${productId}/${colorId}`
    );
};

/**
 * 
Module Cart
 */
export const callAddToCart = (productId: string, sizeId: string, colorId: string, quantity: string) => {
    return axios.post<IBackendRes<void>>(
        `/api/v1/add-to-cart?productId=${productId}&size=${sizeId}&color=${colorId}&quantity=${quantity}`
    );
};

export const callFetchCartDetail = () => {
    return axios.get<IBackendRes<ICartItem>>(`/api/v1/cart`);
}
export const callDeleteCartDetail = (id: string) => {
    return axios.delete<IBackendRes<ICartItem>>(`/api/v1/cart/${id}`);
}
export const callUpdateQuantity = (id: string, quantity: string) => {
    return axios.put<IBackendRes<ICartItem>>(`/api/v1/cart?id=${id}&quantity=${quantity}`);
}

/**
 * 
Module Order
 */
export const callPlaceOrder = (name: string, phone: string, address: string, method: string, totalPrice: string) => {
    return axios.post<IBackendRes<void>>(
        `/api/v1/place-order?receiverName=${name}&receiverPhone=${phone}&receiverAddress=${address}&paymentMethod=${method}&totalPrice=${totalPrice}`
    );
};

/**
 * 
Module DashBoard
 */
export const callFetchCountUsersByDay = () => {
    return axios.get<IBackendRes<number>>(`/api/v1/dashboard/count-user-by-day`);
}