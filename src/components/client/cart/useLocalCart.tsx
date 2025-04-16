import { callFetchCartDetail } from "@/config/api";
import { ICartItem } from "@/types/backend";
import axios from "axios";
import { useEffect, useState } from "react";

export const useLocalCart = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                const response = await callFetchCartDetail();
                const data = response.data;
                if (Array.isArray(data)) {
                    setIsLoggedIn(true);
                    setCartItems(data);
                }
            } else {
                setIsLoggedIn(false);
                const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
                setCartItems(localCart);
            }
        };

        fetchCart();
    }, []);

    const removeItem = (productId: string, colorName: string, sizeName: string) => {
        const updatedCart = cartItems.filter(
            (item) =>
                !(
                    item.productId === productId &&
                    item.colorName === colorName &&
                    item.sizeName === sizeName
                )
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const updateQuantity = async (productId: string, colorId: string, sizeId: string, quantity: number) => {
        if (isLoggedIn) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, {
                    productId, colorId, sizeId, quantity
                }, { withCredentials: true });

                const response = await axios.get(`${backendUrl}/api/cart`, { withCredentials: true });
                setCartItems(response.data);
            } catch (e) {
                console.error("Lỗi cập nhật giỏ hàng:", e);
            }
        } else {
            const updatedCart = cartItems.map((item) => {
                if (
                    item.productId === productId &&
                    item.colorId === colorId &&
                    item.sizeId === sizeId
                ) {
                    return { ...item, quantity: Math.max(1, quantity) };
                }
                return item;
            });
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        }
    };



    return { cartItems, updateQuantity, setCartItems, removeItem };
};