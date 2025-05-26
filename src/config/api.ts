import { IAccount, IBackendRes, ICartItem, ICategory, ICategorySeller, IColor, IDiscount, IGetAccount, IHistory, IModelPaginate, IOrder, IOrderDetail, IOrderProfitDTO, IProduct, IProductDetail, IReview, IRole, ISaleSummary, ISize, ITopProduct, ITopSeller, IUser } from "@/types/backend";
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */

export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
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
export const callFetchUserByEmail = (email: string) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/by-email?email=${email}`);
}
export const callChangePassword = (oldPassword: string, newPassword: string) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users/change-password`, {
        oldPassword,
        newPassword
    });
};

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
export const callCreateProduct = (name: string, price: number, minPrice: number, image: string, detailDesc: string, shortDesc: string, category: ICategory) => {
    return axios.post<IBackendRes<IProduct>>('/api/v1/products', { name, price, minPrice, image, detailDesc, shortDesc, category });
}
export const callUpdateProduct = (id: string, name: string, price: number, minPrice: number, image: string, detailDesc: string, shortDesc: string, category: ICategory) => {
    return axios.put<IBackendRes<IProduct>>(`/api/v1/products`, { id, name, price, minPrice, image, detailDesc, shortDesc, category });
}
export const callDeleteProduct = (id: string) => {
    return axios.delete<IBackendRes<IProduct>>(`/api/v1/products/${id}`);
}
export const callFetchProductsByCategory = (categoryId: string, query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products/by-category/${categoryId}?${query}`);
}
export const callFetchProductsByGender = (gender: string, query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products/${gender}?${query}`);
}
export const callFetchProductsBySearch = (query: string) => {
    return axios.get<IBackendRes<IProduct[]>>(`/api/v1/products/search`, {
        params: { name: query }
    });
}
export const callFetchProductsBySearchQuery = (query: string) => {
    return axios.get<IBackendRes<IProduct[]>>('/api/v1/products/search-query', {
        params: { query }
    });
}
export const callFetchProductsById = (id: string) => {
    return axios.get<IBackendRes<IProduct>>(`/api/v1/products/by-id/${id}`);
}


/**
 * 
 Module category
 */
export const callFetchCategory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(`/api/v1/categories?${query}`);
}
export const callCreateCategory = (name: string, image: string, description: string, path: string, gender: string) => {
    return axios.post<IBackendRes<ICategory>>('/api/v1/categories', { name, image, description, path, gender });
}
export const callUpdateCategory = (id: string, name: string, image: string, description: string, path: string, gender: string) => {
    return axios.put<IBackendRes<ICategory>>(`/api/v1/categories`, { id, name, image, description, path, gender });
}
export const callDeleteCategory = (id: string) => {
    return axios.delete<IBackendRes<ICategory>>(`/api/v1/categories/${id}`);
}
export const callFetchMenuCategory = () => {
    return axios.get<IBackendRes<ICategory[]>>(`/api/v1/list-categories`);
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
export const callFetchProductDetailByProductId = (id: string) => {
    return axios.get<IBackendRes<IProductDetail>>(`/api/v1/productDetails/by-product/${id}`);
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
export const callFetchOrders = () => {
    return axios.get<IBackendRes<IModelPaginate<IOrder>>>(`/api/v1/orders`);
}
export const callUpdateOrders = (id: string, order: IOrder) => {
    return axios.put<IBackendRes<IOrder>>(`/api/v1/orders`, { id, ...order });
}
export const callDeleteOrders = (id: string) => {
    return axios.delete<IBackendRes<IOrder>>(`/api/v1/orders/${id}`);
}
export const callFetchOrdersById = (id: string) => {
    return axios.get<IBackendRes<IOrderDetail[]>>(`/api/v1/orders/${id}`);
}

export const callVNPayReturn = (responseCode: string, txnRef: string) => {
    return axios.get<IBackendRes<any>>(
        `/api/v1/thank?vnp_ResponseCode=${responseCode}&vnp_TxnRef=${txnRef}`
    );
};

/**
 * 
Module DashBoard
 */
export const callFetchCountUsersByDay = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/dashboard/count-user-by-day?startDate=${startDate}&endDate=${endDate}`);
}
export const callFetchCountOrdersByDay = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/dashboard/count-order-by-day?startDate=${startDate}&endDate=${endDate}`);
}
export const callFetchCountCancelOrdersByDay = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/dashboard/count-cancel-order-by-day?startDate=${startDate}&endDate=${endDate}`);
}
export const callFetchTotalPriceByDay = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/dashboard/total-price-by-day?startDate=${startDate}&endDate=${endDate}`);
}
export const callFetchCurrentOrder = (query: string) => {
    return axios.get<IBackendRes<IOrder[]>>(`/api/v1/dashboard/currentOrder`);
}
export const callFetchCategorySaleByDay = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<ICategorySeller[]>>(`/api/v1/dashboard/category-sale?startDate=${startDate}&endDate=${endDate}`);
}
export const callFetchTopSellingProducts = (
    startDate: string,
    endDate: string,
) => {
    return axios.get<IBackendRes<ITopProduct[]>>(
        `/api/v1/orders/top-selling?startDate=${startDate}&endDate=${endDate}`
    );
};

export const callFetchSlowSellingProducts = (
    startDate: string,
    endDate: string,
) => {
    return axios.get<IBackendRes<ITopProduct[]>>(
        `/api/v1/orders/slow-selling?startDate=${startDate}&endDate=${endDate}`
    );
};

export const callFetchITopSellerByDay = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<ITopSeller[]>>(`/api/v1/dashboard/top-seller?startDate=${startDate}&endDate=${endDate}`);
}

export const callFetchISaleChannelSummary = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<ISaleSummary[]>>(
        `/api/v1/dashboard/revenue-by-channel?startDate=${startDate}&endDate=${endDate}`
    );
};
export const callFetchTotalPrice = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/dashboard/total-price?startDate=${startDate}&endDate=${endDate}`);
}

export const callFetchOrderProfit = (startDate: string, endDate: string) => {
    return axios.get<IBackendRes<IOrderProfitDTO[]>>(`/api/v1/dashboard/order-profit?startDate=${startDate}&endDate=${endDate}`);
}

/**
 * 
Module History
 */
export const callFetchOrderHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IHistory>>>(`/api/v1/history?${query}`);
}

/**
 * 
Module Rate
 */
export const callCreateRate = (review: IReview) => {
    return axios.post<IBackendRes<IReview>>('/api/v1/review', { ...review });
}
export const callFetchReview = (id: string, query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IReview>>>(`/api/v1/review?id=${id}&${query}`);
}
/**
 * 
Module Message
 */
export const callFetchUpdateIsRead = (id: string) => {
    return axios.put<IBackendRes<any>>(`/api/v1/messages/mark-as-read/${id}`);
}

/**
 * 
Module Discount
 */
export const callFetchDiscount = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IDiscount>>>(`/api/v1/discounts?${query}`);
}
export const callCreateDiscount = (discount: IDiscount) => {
    return axios.post<IBackendRes<IDiscount>>('/api/v1/discounts', { ...discount });
}
export const callUpdateDiscount = (discount: IDiscount, id: string) => {
    return axios.put<IBackendRes<IDiscount>>(`/api/v1/discounts`, { id, ...discount });
}
export const callDeleteDiscount = (id: string) => {
    return axios.delete<IBackendRes<IDiscount>>(`/api/v1/discounts/${id}`);
}
export const callFetchTop3Discount = () => {
    return axios.get<IBackendRes<IDiscount[]>>(`/api/v1/discounts/discounts-top3`);
}
export const callApplyDiscount = (totalPrice: string, code: string) => {
    return axios.get<IBackendRes<number>>(`/api/v1/apply-discount?code=${code}&totalPrice=${totalPrice}`);
}