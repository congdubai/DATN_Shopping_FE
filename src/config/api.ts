import { IAccount, IBackendRes, ICategory, IColor, IGetAccount, IModelPaginate, IProduct, IRole, ISize, IUser } from "@/types/backend";
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
export const callFetchColorById = (id: string) => {
    return axios.get<IBackendRes<IColor>>(`/api/v1/colors/${id}`);
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
export const callFetchSizeById = (id: string) => {
    return axios.get<IBackendRes<ISize>>(`/api/v1/sizes/${id}`);
}