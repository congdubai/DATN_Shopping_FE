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

    const updateQuantity = (
        productId: string,
        colorId: string,
        sizeId: string,
        newQuantity: number
    ) => {
        const updatedCart = cartItems.map((item) => {
            if (
                item.productId === productId &&
                item.colorId === colorId &&
                item.sizeId === sizeId
            ) {
                return { ...item, quantity: Math.max(newQuantity, 1) };
            }
            return item;
        });

        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };



    return { cartItems, updateQuantity, setCartItems, removeItem };
};