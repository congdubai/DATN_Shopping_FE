import { useEffect, useState } from "react";
import axios from "axios";
import { Breadcrumb, Button, Card, Col, Divider, Input, InputNumber, notification, Row } from "antd";
import { callDeleteCartDetail, callFetchCartDetail, callUpdateQuantity } from "@/config/api";
import { useLocalCart } from "@/components/client/cart/useLocalCart";
import { useNavigate } from "react-router-dom";
import { setRedirectPath } from "@/redux/slice/accountSlide";
import { setDiscountCode } from "@/redux/slice/discountSlide";
import { useAppDispatch } from "@/redux/hooks";


const CartPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { cartItems, updateQuantity, removeItem, setCartItems } = useLocalCart();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        updateCartData();
    }, []);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const navigate = useNavigate();
    const updateCartData = async () => {
        const token = localStorage.getItem("access_token");

        if (token) {
            try {
                setLoading(true);
                const res = await axios.get(`${backendUrl}/api/v1/cart`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const serverCart = res.data.data;
                setCartItems(serverCart);
                localStorage.setItem("cart", JSON.stringify(serverCart));

                // Cập nhật cart_quantity từ server
                const totalQuantity = serverCart.reduce((sum: number, item: any) => sum + 1, 0);
                localStorage.setItem("cart_quantity", totalQuantity.toString());
                window.dispatchEvent(new Event("cartQuantityChanged"));

                setLoading(false);
            } catch (err) {
                console.error("Error fetching cart data:", err);
                setLoading(false);
            }
        }
    };

    const handleCheckout = async () => {
        navigate("/checkout");
    };


    const handleDelete = async (productId: string, colorName: string, sizeName: string) => {
        const token = localStorage.getItem("access_token");

        const updateCartQuantity = () => {
            const currentQuantity = parseInt(localStorage.getItem("cart_quantity") || "0", 10);
            const newQuantity = Math.max(currentQuantity - 1, 0); // không bao giờ âm
            localStorage.setItem("cart_quantity", newQuantity.toString());
        };

        if (!token) {
            // Chưa đăng nhập => Xóa local
            removeItem(productId, colorName, sizeName);
            updateCartQuantity();
            window.dispatchEvent(new Event("cartQuantityChanged"));
        } else {
            try {
                const res = await axios.get(`${backendUrl}/api/v1/cart`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const cartItems = res.data.data;
                const itemToDelete = cartItems.find(
                    (item: any) =>
                        item.productId === productId &&
                        item.colorName === colorName &&
                        item.sizeName === sizeName
                );

                if (itemToDelete) {
                    const deleteRes = await callDeleteCartDetail(itemToDelete.id);
                    if (deleteRes.statusCode === 200) {
                        updateCartData();
                        removeItem(productId, colorName, sizeName);
                        updateCartQuantity();
                        window.dispatchEvent(new Event("cartQuantityChanged"));
                    }
                }
            } catch (err) {
                console.error("Error deleting cart item:", err);
            }
        }
    };



    return (
        <div style={{ padding: "20px", paddingTop: 160, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Row justify="center">

                <Col span={19}>
                    <Col style={{ paddingTop: 5, paddingBottom: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                            <Breadcrumb.Item>Giỏ hàng</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={14} >
                            <Card bordered={false} style={{ borderRadius: 3 }}>
                                <Row align="middle">
                                    <Col
                                        xs={24}
                                        md={24}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: -15
                                        }}
                                    >
                                        <h2 style={{ margin: 0 }}>Giỏ hàng:</h2>
                                        <p>
                                            <a
                                                href="#"
                                                style={{
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: "4px",
                                                    color: "black"
                                                }}
                                            >
                                                {cartItems.length} Sản phẩm
                                            </a>
                                        </p>
                                    </Col>
                                    <Divider style={{ margin: "10px 0" }} />

                                    <Col span={24}>
                                        <div style={{ borderRadius: 5, backgroundColor: "#fcf4ec", padding: "8px 5px" }}>Bạn được <b>giảm 10%</b> tối đa 10K, mua đơn hàng trên 350,000₫ để giảm ngay 50K!</div>
                                    </Col>
                                    {cartItems.length === 0 ? (
                                        <div style={{ padding: "20px 5px", fontSize: 16, fontFamily: "'Geologica', sans-serif" }}>
                                            Chưa có sản phẩm nào trong giỏ hàng.
                                        </div>
                                    ) : (

                                        cartItems.map((item, index) => (
                                            <Row key={index} style={{ marginTop: 25, alignItems: "start", width: 610 }}>
                                                {/* Ảnh sản phẩm */}
                                                <Col span={6}>
                                                    <img
                                                        src={`${backendUrl}/storage/product/${item.productImage}`}
                                                        alt="Sản phẩm"
                                                        style={{ width: "100%", borderRadius: "2px", height: "140px" }}
                                                    />
                                                </Col>

                                                {/* Thông tin sản phẩm */}
                                                <Col flex="1" style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
                                                    <h3 style={{ margin: 0 }}>{item.productName}</h3>
                                                    <p style={{ margin: "5px 0" }}>
                                                        Size: {item.sizeName} - Màu: {item.colorName}
                                                    </p>

                                                    <Col
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            width: "100%",
                                                            marginTop: 8
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <Button
                                                                danger
                                                                onClick={() => {
                                                                    const newQuantity = item.quantity - 1;
                                                                    if (newQuantity > 0) {
                                                                        updateQuantity(item.productId, item.colorName, item.sizeName, newQuantity); // Cập nhật local
                                                                        callUpdateQuantity(String(item.id), String(newQuantity)) // Cập nhật server
                                                                            .then(() => updateCartData()) // reload lại giỏ hàng từ server
                                                                            .catch(err => console.error("Update quantity failed:", err));
                                                                    }
                                                                }}
                                                            >-</Button>

                                                            <InputNumber
                                                                min={1}
                                                                value={item.quantity}
                                                                onChange={(value) => {
                                                                    if (typeof value === "number" && value > 0) {
                                                                        updateQuantity(item.productId, item.colorName, item.sizeName, value); // local
                                                                        callUpdateQuantity(String(item.id), String(value))
                                                                            .then(() => updateCartData())
                                                                            .catch((err) => console.error("Update quantity failed:", err));
                                                                    }
                                                                }}
                                                                className="custom-input-number"
                                                                style={{
                                                                    width: 46,
                                                                    border: "none",
                                                                    boxShadow: "none"
                                                                }}
                                                                controls={false}
                                                            />

                                                            <Button
                                                                danger
                                                                onClick={() => {
                                                                    const newQuantity = item.quantity + 1;
                                                                    updateQuantity(item.productId, item.colorName, item.sizeName, newQuantity); // Cập nhật local
                                                                    callUpdateQuantity(String(item.id), String(newQuantity))
                                                                        .then(() => updateCartData())
                                                                        .catch(err => console.error("Update quantity failed:", err));
                                                                }}
                                                            >+</Button>


                                                        </div>
                                                        <h3 style={{ margin: 0 }}>
                                                            {(item.price * item.quantity).toLocaleString()}đ
                                                        </h3>
                                                    </Col>
                                                </Col>

                                                {/* Nút xóa */}
                                                <Col span={4} style={{ textAlign: "right" }}>
                                                    <img
                                                        src={`${backendUrl}/storage/slide/close.png`}
                                                        style={{ width: 12, height: 12, cursor: "pointer" }}
                                                        onClick={() => handleDelete(item.productId, item.colorName, item.sizeName)}
                                                    />
                                                </Col>
                                                <Divider style={{ margin: "5px 0" }} />
                                            </Row>
                                        ))

                                    )}


                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} md={10}>
                            <Card bordered={false} style={{ borderRadius: 3 }}>
                                <h2 style={{ marginTop: -10 }}>Thông tin đơn hàng</h2>
                                <div style={{ paddingTop: 10 }}>
                                    {/* Tạm tính */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <p style={{ fontSize: 18, margin: 0 }}>Tạm tính:</p>
                                        <p style={{ fontSize: 18, margin: 0 }}>{totalPrice.toLocaleString()}đ</p>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <p style={{ fontSize: 18, margin: 0 }}>Giá giảm:</p>
                                        <p style={{ fontSize: 18, margin: 0 }}>0đ</p>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <p style={{ fontSize: 18, margin: 0 }}>Tổng tiền:</p>
                                        <h3 style={{ margin: 0 }}>{totalPrice.toLocaleString()}đ</h3>
                                    </div>
                                </div>

                                <h3 style={{ marginTop: 10 }}>Ghi chú đơn hàng</h3>
                                <Input.TextArea placeholder="Ghi chú" style={{ marginBottom: "10px" }} />
                                <h3>Mã khuyến mãi</h3>
                                <Input
                                    placeholder="Nhập mã khuyến mãi"
                                    onChange={(e) => dispatch(setDiscountCode(e.target.value))}
                                    style={{ marginBottom: "10px" }}
                                    prefix={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <img
                                                src={`${backendUrl}/storage/slide/discount.png`}
                                                alt="Voucher"
                                                style={{ width: 18, height: 18, marginRight: 5 }}
                                            />
                                        </div>}
                                />

                                <Button
                                    type="primary"
                                    block
                                    disabled={cartItems.length === 0}
                                    style={{
                                        backgroundColor: cartItems.length === 0 ? "#222222	" : "black",
                                        fontFamily: "'Geologica', sans-serif",
                                        height: 40,
                                        borderRadius: 2,
                                        marginTop: 15,
                                        border: "none",
                                        color: "white"
                                    }}
                                    onClick={() => {
                                        const accessToken = localStorage.getItem('access_token');

                                        if (!accessToken) {
                                            notification.error({
                                                message: 'Thông báo',
                                                description: 'Vui lòng đăng nhập để tiếp tục!',
                                                placement: 'topRight',
                                            });
                                            dispatch(setRedirectPath(location.pathname));
                                            navigate('/login');
                                        } else {
                                            handleCheckout();
                                        }
                                    }}
                                >
                                    THANH TOÁN NGAY
                                </Button>

                                <Button type="link" block style={{
                                    color: "black", fontSize: 15, marginTop: 8, fontFamily: "'Geologica', sans-serif"
                                }} onClick={() => { navigate('/'); }
                                }>
                                    <img
                                        src={`${backendUrl}/storage/slide/back.png`}
                                        style={{ width: 18, height: 14, marginRight: 5 }}
                                    />     Tiếp tục mua hàng</Button>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    );
};

export default CartPage;
