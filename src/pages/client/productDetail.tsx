import React, { useEffect, useState } from "react";
import { Row, Col, Image, Carousel, Typography, Tag, Button, InputNumber, Radio, Tabs, Flex, notification, message, Rate, Avatar, Dropdown, Menu, Pagination } from "antd";
import { DownOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, StarFilled, UserOutlined } from "@ant-design/icons";
import { callAddToCart, callFetchProductDetailById, callFetchProductsById } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IProduct, IProductDetail, IReview } from "@/types/backend";
import { useParams } from "react-router-dom";
import { fetchReviewByProductId } from "@/redux/slice/reviewSlide";
import dayjs from "dayjs";
import { fetchProductDetailByProductId } from "@/redux/slice/productDetailSlide";
import StarRating from "@/components/client/home/StarRating";
const { Title, Text } = Typography;

const ProductDetailClientPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useAppDispatch();
    const reviews = useAppSelector(state => state.review.result);
    const meta = useAppSelector(state => state.review.meta);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const productDetails = useAppSelector(state => state.productDetail.result);
    const [selectedImage1, setSelectedImage1] = useState<string>();
    const productImages = Array.from(new Set(productDetails.map(p => p.imageDetail)));
    const [filteredStar, setFilteredStar] = useState<number | null>();

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetailByProductId({ productId }))
            dispatch(fetchReviewByProductId({
                id: productId!,
                query: `page=${currentPage}&size=${pageSize}`
            }));
        }
    }, [productId, dispatch, currentPage, pageSize]);

    useEffect(() => {
        setSelectedImage1(productImages[0])
    }, [productDetails])



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

    useEffect(() => {
        setSelectedImage1(selectedProduct?.imageDetail);
    }, [selectedProduct])

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

        const foundIndex = existingCart.findIndex((item: any, index: number) => {
            const isProductMatch = String(item.productId) === String(cartItem.productId);
            const isColorMatch = String(item.colorId) === String(cartItem.colorId);
            const isSizeMatch = String(item.sizeId) === String(cartItem.sizeId);
            return isProductMatch && isColorMatch && isSizeMatch;
        });

        if (foundIndex !== -1) {
            return;
        } else {
            // Nếu chưa có sản phẩm trong giỏ, thêm sản phẩm vào giỏ hàng
            existingCart.push({
                productId: cartItem.productId,
                colorId: cartItem.colorId,
                sizeId: cartItem.sizeId,
                quantity: 1,
                productName: selectedProduct?.product?.name || "",
                productImage: selectedProduct?.imageDetail || "",
                price: selectedProduct?.product?.price || 0,
                colorName: selectedProduct?.color?.name || "",
                sizeName: selectedProduct?.size?.name || "",
            });

        }
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(existingCart));

        // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = existingCart.reduce((sum: number, item: any) => sum + 1, 0);
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
    const handleInputChange = (value: number | null) => {
        if (!value || value < 1) {
            setQuantity(1);
        } else if (value > selectedProductQuantity) {
            setQuantity(selectedProductQuantity);
        } else {
            setQuantity(value);
        }
    };

    const starMenuItems = [
        {
            key: 'all',
            label: 'Tất cả',
            onClick: () => setFilteredStar(null),
        },
        ...[5, 4, 3, 2, 1].map((star) => ({
            key: star.toString(),
            label: `${star} sao`,
            onClick: () => setFilteredStar(star),
        }))
    ];
    const filteredReviews = filteredStar
        ? reviews.filter((review) => review.rating === filteredStar)
        : reviews;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length) : 0;

    return (
        <>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "160px", backgroundColor: "#f5f5f5" }}>
                <div style={{ maxWidth: 1400, padding: "20px" }}>
                    <Row gutter={[32, 32]} style={{ marginLeft: 120 }}>
                        <Col md={10} style={{ backgroundColor: "white", padding: "10px" }}>
                            <Carousel>
                                {productDetails.map((img, index) => (
                                    <Image
                                        key={index}
                                        src={`${backendUrl}/storage/product/${selectedImage1}`}
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
                                            src={`${backendUrl}/storage/product/${img}`}
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

                            <Title level={3} style={{ color: "#ff0000", display: "inline-block", marginRight: 10, marginTop: 10 }}>{productDetails[0]?.product?.price}đ</Title>
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
                                        disabled={quantity <= 1}
                                    />
                                    <InputNumber
                                        min={1}
                                        max={selectedProductQuantity}
                                        value={quantity}
                                        onChange={handleInputChange}
                                        style={{
                                            width: 70,
                                            textAlign: "center",
                                            border: "none",
                                            boxShadow: "none",
                                            outline: "none",
                                            marginLeft: 12
                                        }}
                                        controls={false}
                                    />

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
                            <div>
                                <p style={{ marginTop: 100 }}>
                                    <strong>Mô tả:</strong>
                                    <p style={{ marginTop: 8 }}>{productDetails[0]?.product?.shortDesc}</p>
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Tabs defaultActiveKey="1" style={{ backgroundColor: "white", marginTop: 20, width: 1070, marginLeft: 120 }}
                        tabBarStyle={{ marginLeft: 10, fontWeight: 500 }}>
                        <Tabs.TabPane tab="Mô tả" key="1" style={{ marginLeft: 20, marginBottom: 10 }}>
                            <span dangerouslySetInnerHTML={{ __html: productDetails[0]?.product?.detailDesc || "" }} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Đánh giá" key="2" style={{ marginLeft: 20, marginBottom: 10 }}>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                    {/* Bên trái: 4.6 + Rate + 45 lượt đánh giá */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 24, fontWeight: "bold" }}>{averageRating.toFixed(1)}</span>

                                        <div style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 16, marginTop: 3 }}>
                                            <StarRating rating={averageRating!} />
                                        </div>

                                        <span style={{ color: "#888" }}>{reviews.length} lượt đánh giá</span>
                                    </div>

                                    {/* Bên phải: Nút Sao ★ */}
                                    <Dropdown menu={{ items: starMenuItems }} placement="bottomLeft">
                                        <Button type="text" style={{ border: "1px solid #d9d9d9", color: "#000", marginRight: 20, width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <h4 style={{ margin: 0 }}>Sao</h4>
                                            <span style={{ color: "#fadb14", marginLeft: 5, fontSize: 14 }}>
                                                <StarFilled />
                                            </span>
                                            <DownOutlined style={{ marginLeft: 10, color: "gray" }} />
                                        </Button>
                                    </Dropdown>
                                </div>
                                {/* Một đánh giá */}
                                {filteredReviews.map((review) => (
                                    <div key={review.id} style={{ paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                            <Avatar
                                                size="large"
                                                src={`${backendUrl}/storage/avatar/${review?.avatar ? review.avatar : undefined}`}
                                                icon={!review?.avatar && <UserOutlined />}
                                            />
                                            <div>
                                                <div style={{ fontWeight: "bold" }}>{review.userName || "Ẩn danh"}</div>
                                                <Rate disabled defaultValue={review.rating} style={{ fontSize: 16, margin: "4px 0" }} />
                                                <div style={{ marginTop: 8, color: "#888" }}>Đánh giá vào: <>{review.createdAt ? dayjs(review.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</></div>
                                                <div style={{ marginTop: 8, lineHeight: 1.6 }}>
                                                    <span style={{ color: "#888" }}>Bình luận: </span>
                                                    <span
                                                        style={{ fontWeight: "bold", display: "inline" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: (review.comment || "Không có bình luận").replace(/<br\s*\/?>/gi, " ").replace(/<\/?p[^>]*>/gi, "")
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {reviews.length > 0 && (
                                    <div style={{ textAlign: "right", marginTop: 10, marginRight: 20 }}>
                                        <Pagination
                                            current={meta.page}
                                            pageSize={meta.pageSize}
                                            showSizeChanger
                                            total={meta.total}
                                            showTotal={(total, range) => `${range[0]}-${range[1]} trên ${total} rows`}
                                            onChange={(page, pageSize) => setCurrentPage(page)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Tabs.TabPane>
                    </Tabs>

                </div >
            </div >
        </>
    );
};

export default ProductDetailClientPage;
