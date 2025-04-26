import { useEffect, useState } from "react";
import axios from "axios";
import { Breadcrumb, Button, Card, Col, Divider, Input, notification, Row } from "antd";
import { callDeleteCartDetail, callFetchCartDetail, callUpdateQuantity } from "@/config/api";
import { useLocalCart } from "@/components/client/cart/useLocalCart";
import { useNavigate } from "react-router-dom";
import { setRedirectPath } from "@/redux/slice/accountSlide";
import { useDispatch } from "react-redux";


const HistoryPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { cartItems, updateQuantity, removeItem, setCartItems } = useLocalCart();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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

    return (
        <div style={{ padding: "20px", paddingTop: 160, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Row justify="center">
                <Col span={19}>
                    <Col style={{ paddingTop: 5, paddingBottom: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                            <Breadcrumb.Item>Lịch sử mua hàng</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} >
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
                                        <h2 style={{ margin: 0 }}>Lịch sử đơn hàng:</h2>
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

                                    {cartItems.length === 0 ? (
                                        <div style={{ padding: "20px 5px", fontSize: 16, fontFamily: "'Geologica', sans-serif" }}>
                                            Bạn chưa mua đơn nào.
                                        </div>
                                    ) : (

                                        cartItems.map((item, index) => (
                                            <Row key={index} style={{ marginTop: 25, alignItems: "start", width: "100%" }}>
                                                <Col span={6} xs={24} md={3}>
                                                    <img
                                                        src={`${backendUrl}/storage/product/${item.productImage}`}
                                                        alt="Sản phẩm"
                                                        style={{ width: "100%", borderRadius: "2px", height: "120px" }}
                                                    />
                                                </Col>

                                                {/* Thông tin sản phẩm */}
                                                <Col xs={24} md={15} flex="1" style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
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
                                                        <h3 style={{ margin: 0 }}>
                                                            x1
                                                        </h3>
                                                    </Col>
                                                </Col>

                                                <Col xs={24} md={6} style={{ textAlign: "right", marginTop: "-5px" }}>
                                                    <span style={{ color: "red", fontWeight: 600, fontSize: 18 }}>Đã hoàn thành</span>

                                                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4 style={{ marginLeft: 170, textDecoration: 'line-through', color: "gray" }}>{item.price.toLocaleString()}</h4>
                                                        <h4 style={{ margin: 0 }}>{item.price.toLocaleString()}</h4>
                                                    </div>

                                                    <div style={{ marginTop: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4 style={{ marginLeft: 120, fontWeight: 500 }}>Tổng số tiền:</h4>
                                                        <h3 style={{ margin: 0 }}>
                                                            {(item.price * item.quantity).toLocaleString()}đ
                                                        </h3>
                                                    </div>
                                                    <div style={{ margin: "20px 0" }}>
                                                        <Button style={{ margin: "0 5px", fontFamily: "'Geologica', sans-serif" }} >Xem chi tiết đơn hàng</Button>
                                                        <Button style={{ backgroundColor: "black", fontFamily: "'Geologica', sans-serif", color: "white" }}>Đánh giá</Button>
                                                    </div>
                                                </Col>
                                                <Divider style={{ margin: "5px 0" }} />
                                            </Row>
                                        ))

                                    )}
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Col >
            </Row >
        </div >
    );
};

export default HistoryPage;
