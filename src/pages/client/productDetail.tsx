import React, { useEffect, useState } from "react";
import { Row, Col, Image, Carousel, Typography, Tag, Button, InputNumber, Radio, Tabs, Flex, notification, message } from "antd";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { callAddToCart } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IProductDetail } from "@/types/backend";
import { fetchProductDetailById } from "@/redux/slice/productDetailSlide";
import { useParams } from "react-router-dom";


const { Title, Text } = Typography;

const ProductDetailClientPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useAppDispatch();
    const { result: productDetails = [], isFetching } = useAppSelector(
        (state: any) => state.productDetail
    ) as { result: IProductDetail[]; isFetching: boolean };

    const productImages = [
        `${backendUrl}/storage/slide/slide-1.webp`,
        `${backendUrl}/storage/slide/slide-2.jpg`,
        `${backendUrl}/storage/slide/slide-3.webp`,
        `${backendUrl}/storage/slide/slide-4.webp`,
    ];

    useEffect(() => {
        console.log("check value", productId)
        if (productId) {
            dispatch(fetchProductDetailById({ productId }))
        }

    }, [productId, dispatch]);

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
            notification.success({
                message: 'Thành công',
                description: 'Bạn đã thêm sản phẩm vào giỏ!',
                placement: 'topRight',
            });
        }
    };

    const [selectedImage1, setSelectedImage1] = useState(productImages[0]);

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "160px", backgroundColor: "#f5f5f5" }}>
            <div style={{ maxWidth: 1400, padding: "20px" }}>
                <Row gutter={[32, 32]} style={{ marginLeft: 120 }}>
                    <Col md={10} style={{ backgroundColor: "white", padding: "10px" }}>
                        <Carousel>
                            {productImages.map((img, index) => (
                                <Image
                                    key={index}
                                    src={selectedImage1}
                                    width={500}
                                    height={450}
                                    style={{ objectFit: "cover" }}
                                />
                            ))}
                        </Carousel>
                        <Row gutter={8} style={{ marginTop: 10 }}>
                            {productImages.map((img, index) => (
                                <Col key={index}>
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index}`}
                                        width={80}
                                        height={80}
                                        onClick={() => setSelectedImage1(img)}
                                        style={{
                                            cursor: "pointer",
                                            border: img === selectedImage1 ? "2px solid #000" : "none",
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Thông tin sản phẩm */}
                    <Col
                        className="custom-padding"
                        md={10}
                        style={{
                            backgroundColor: "white",
                            marginLeft: 20,
                            padding: "8px",
                            margin: "0 !important",
                        }}
                    >

                        <Title level={4}>{productDetails[0]?.product?.name || "Sản phẩm"}</Title>
                        <div style={{ marginTop: -10 }}>
                            <Text style={{ fontSize: 12 }}>Loại:</Text> <Text strong style={{ fontSize: 12 }}>{productDetails[0]?.product?.category?.name}</Text>
                            <span style={{ margin: '0 8px', color: "gray", fontSize: 12 }}>|</span>
                            <Text style={{ fontSize: 12 }}>MSP:</Text> <Text strong style={{ fontSize: 12 }}>{productDetails[0]?.product?.id}</Text>
                        </div>
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

                        <Title level={3} style={{ color: "#ff0000", display: "inline-block", marginRight: 10, marginTop: 10 }}>{productDetails[0]?.product?.price}</Title>
                        <Text delete style={{ fontSize: 16, color: "gray", marginTop: 8 }}>499.000đ</Text>
                        <p>
                            <strong>Màu sắc:</strong>
                        </p>
                        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
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
                        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
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
                    </Col>
                </Row>
                <Tabs defaultActiveKey="1" style={{ backgroundColor: "white", marginTop: 20, width: 1070, marginLeft: 120 }}
                    tabBarStyle={{ marginLeft: 10, fontWeight: 500 }}>
                    <Tabs.TabPane tab="Mô tả" key="1" style={{ margin: 10 }}>
                        Nội dung mô tả sản phẩm...
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đánh giá" key="2" style={{ margin: 10 }}>
                        Nội dung chính sách giao hàng...
                    </Tabs.TabPane>
                </Tabs>
            </div >
        </div >
    );
};

export default ProductDetailClientPage;
