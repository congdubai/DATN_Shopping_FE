import { Modal, Button, Flex, message, notification } from "antd";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IProductDetail } from "@/types/backend";
import { motion } from "framer-motion";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { callAddToCart } from "@/config/api";
import { fetchProductDetailByProductId } from "@/redux/slice/productDetailSlide";

interface IProps {
    isOpenModal: boolean;
    setIsOpenModal: (v: boolean) => void;
    productId?: string;
}

const HomeModal = ({ isOpenModal, setIsOpenModal, productId }: IProps) => {
    const dispatch = useAppDispatch();
    const { result: productDetails = [], isFetching } = useAppSelector(
        (state: any) => state.productDetail
    ) as { result: IProductDetail[]; isFetching: boolean };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetailByProductId({ productId }))
        }
        if (!isOpenModal) {
            setQuantity(1);
        }
    }, [productId, dispatch, isOpenModal]);

    const [quantity, setQuantity] = useState(1);

    const increase = () => {
        setQuantity(prev => (prev < selectedProductQuantity ? prev + 1 : prev));
    };

    const decrease = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };
    const colors = productDetails.length ? [...new Set(productDetails.map((p) => p.color?.name))] : [];
    const sizes = productDetails.length ? [...new Set(productDetails.map((p) => p.size?.name))] : [];

    const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);

    useEffect(() => {
        if (colors.length > 0) setSelectedColor(colors[0]);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
    }, [productDetails]);

    const selectedProduct = productDetails.find(
        (p) => p.color?.name === selectedColor && p.size?.name === selectedSize
    );
    const selectedProductQuantity = selectedProduct?.quantity || 0;
    const isInStock = selectedProductQuantity > 0;

    const selectedImage = selectedProduct?.imageDetail || "";


    const updateLocalStorageCart = (item: {
        productId: string;
        colorId: string;
        sizeId: string;
        quantity: number;
    }) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const foundIndex = existingCart.findIndex(
            (p: any) =>
                String(p.productId) === String(item.productId) &&
                String(p.colorId) === String(item.colorId) &&
                String(p.sizeId) === String(item.sizeId)
        );

        if (foundIndex !== -1) {
            return;
        } else {
            const newItem = {
                ...item,
                productName: selectedProduct?.product?.name || "",
                productImage: selectedProduct?.imageDetail || "",
                price: selectedProduct?.product?.price || 0,
                colorName: selectedProduct?.color?.name || "",
                sizeName: selectedProduct?.size?.name || "",
            };
            existingCart.push(newItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        const totalQuantity = existingCart.reduce((sum: number, item: any) => sum + 1, 0);
        localStorage.setItem("cart_quantity", totalQuantity.toString());
        window.dispatchEvent(new Event("cartQuantityChanged"));
    };

    const updateCartQuantityInLocalStorage = (cartItem: { productId: string, sizeId: string, colorId: string, quantity: number }) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const foundIndex = existingCart.findIndex(
            (item: any) =>
                String(item.productId) === String(cartItem.productId) &&
                String(item.colorId) === String(cartItem.colorId) &&
                String(item.sizeId) === String(cartItem.sizeId)
        );

        if (foundIndex !== -1) {
            return;
        }

        // Nếu chưa có sản phẩm trong giỏ, thêm sản phẩm vào giỏ hàng
        existingCart.push({
            ...cartItem,
            productName: selectedProduct?.product?.name || "",
            productImage: selectedProduct?.imageDetail || "",
            price: selectedProduct?.product?.price || 0,
            colorName: selectedProduct?.color?.name || "",
            sizeName: selectedProduct?.size?.name || "",
            quantity: 1,
        });

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(existingCart));

        // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = existingCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        localStorage.setItem("cart_quantity", totalQuantity.toString());

        // Gửi sự kiện cập nhật giỏ hàng
        window.dispatchEvent(new Event("cartQuantityChanged"));
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) {
            message.error("Vui lòng chọn đầy đủ màu và kích thước!");
            return;
        }

        // Tạo đối tượng giỏ hàng
        const cartItem = {
            productId: selectedProduct.product!.id,
            sizeId: selectedProduct.size!.id,
            colorId: selectedProduct.color!.id,
            quantity: quantity,
        };

        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        const isLoggedIn = Boolean(localStorage.getItem('access_token'));  // Kiểm tra token

        if (isLoggedIn) {
            // Nếu đã đăng nhập, gọi API để thêm sản phẩm vào giỏ hàng
            try {
                const res = await callAddToCart(
                    selectedProduct.product!.id,
                    selectedProduct.size!.id.toString(),
                    selectedProduct.color!.id.toString(),
                    quantity.toString()
                );

                if (res.statusCode === 200) {
                    setIsOpenModal(false);
                    notification.success({
                        message: 'Thành công',
                        description: 'Bạn đã thêm sản phẩm vào giỏ!',
                        placement: 'topRight',
                    });

                    // Cập nhật lại số lượng giỏ hàng trong localStorage sau khi đăng nhập
                    updateCartQuantityInLocalStorage(cartItem);
                } else {
                    notification.error({
                        message: 'Thất bại',
                        description: 'Thêm giỏ hàng thất bại!',
                        placement: 'topRight',
                    });
                }
            } catch (err) {
                console.error("Lỗi thêm vào giỏ:", err);
                message.error("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
            }
        } else {
            updateLocalStorageCart(cartItem);
            setIsOpenModal(false);
            notification.success({
                message: 'Thành công',
                description: 'Bạn đã thêm sản phẩm vào giỏ!',
                placement: 'topRight',
            });
        }
    };



    return (
        <Modal open={isOpenModal} onCancel={() => setIsOpenModal(false)} footer={null} width={800}>
            <div style={{ display: "flex" }}>
                {selectedImage ? (
                    <div style={{ width: "50%", height: 420, borderRadius: 10, overflow: "hidden" }}>
                        <motion.img
                            key={selectedImage}
                            src={`${backendUrl}/storage/product/${selectedImage}`}
                            alt="Product Image"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 10,
                            }}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            width: "50%",
                            height: 420,
                            backgroundColor: "#ffcccc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "red",
                            fontSize: 20,
                            fontWeight: "bold",
                            borderRadius: 10,
                            border: "2px dashed red",
                        }}
                    >
                        Not Image
                    </div>
                )}

                {/* Thông tin sản phẩm */}
                <div style={{ marginLeft: 20, marginRight: 10, width: "50%" }}>
                    <h2>{productDetails[0]?.product?.name || "Sản phẩm"}</h2>
                    <p style={{ marginTop: 5 }}>
                        <strong>SLg: </strong> {selectedProduct?.quantity}{" "}
                        <span
                            style={{
                                color: "white",
                                background: isInStock ? "#38bf57" : "red",
                                fontSize: 12,
                                fontWeight: 520,
                                borderRadius: 3,
                                padding: "3px 6px",
                                marginLeft: 8
                            }}
                        >
                            {isInStock ? "Còn hàng" : "Hết hàng"}
                        </span>
                    </p>
                    <p style={{ fontSize: "20px", color: "red" }}>
                        <strong>{selectedProduct?.product?.price?.toLocaleString()}đ</strong>
                    </p>

                    <p>
                        <strong>Màu sắc:</strong>
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {colors.map((color) => {
                            const isSelected = selectedColor === color;
                            const colorCode = productDetails.find((p) => p.color?.name === color)?.color?.hexCode || "#000"; // Lấy mã màu từ API

                            return (
                                <div
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        width: 31,
                                        height: 30,
                                        borderRadius: "50%",
                                        backgroundColor: colorCode,
                                        border: isSelected ? "2px solid black" : "1px solid #ccc",
                                        cursor: "pointer"
                                    }}
                                />
                            );
                        })}
                    </div>

                    <p style={{ marginTop: 8 }}>
                        <strong>Kích thước:</strong>
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {sizes.map((size) => (
                            <Button
                                key={size}
                                type="default"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "white",
                                    width: 40,
                                    height: 30,
                                    color: "black",
                                    border: selectedSize === size ? "2px solid black" : "1px solid #ccc",
                                    fontWeight: selectedSize === size ? "bold" : "normal",
                                    padding: 0,
                                }}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                        <Flex
                            align="center"
                            justify="space-between"
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                display: "inline-flex",
                                width: "120px",
                            }}
                        >
                            <Button
                                type="text"
                                icon={<MinusOutlined style={{ fontSize: 16 }} />}
                                onClick={decrease}
                            />
                            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{quantity}</span>
                            <Button
                                type="text"
                                icon={<PlusOutlined style={{ fontSize: 16 }} />}
                                onClick={increase}
                                disabled={quantity >= selectedProductQuantity}
                            />
                        </Flex>

                        <Button
                            type="primary"
                            style={{ backgroundColor: "black", color: "white", height: 40, width: 150 }}
                            disabled={selectedProductQuantity === 0}
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ
                        </Button>

                    </div>

                    {/* Link "Xem chi tiết »" */}
                    <p style={{ marginTop: 20 }}>
                        <a
                            href={`/product/detail?id=${productId}`}
                            style={{
                                textDecoration: "underline",
                                textUnderlineOffset: "4px",
                                color: "black"
                            }}
                        >
                            Xem chi tiết »
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default HomeModal;
