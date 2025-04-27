import AddressSelector from "@/components/admin/user/location.user";
import { useLocalCart } from "@/components/client/cart/useLocalCart";
import { callPlaceOrder } from "@/config/api";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Breadcrumb, Button, Card, Col, Divider, Input, Row, Form, Radio, message, notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckOutPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { cartItems } = useLocalCart();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {

        const { name, phone, address } = values;
        const fullAddress = Array.isArray(address) ? address.join(", ") : address;

        const res = await callPlaceOrder(
            name,
            phone,
            fullAddress,
            paymentMethod,
            totalPrice.toString()
        );

        if (res.statusCode === 200) {
            localStorage.removeItem("cart");
            localStorage.setItem("cart_quantity", "0");
            window.dispatchEvent(new Event("cartQuantityChanged"));
            notification.success({
                message: 'Đặt hàng hành công',
                description: 'Cảm ơn bạn đã mua hàng!',
                placement: 'topRight',
            });
            navigate("/");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    };

    return (
        <>
            <div style={{ padding: "20px", paddingTop: 160, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Row justify="center">

                    <Col span={19}>
                        <Col style={{ paddingTop: 5, paddingBottom: 20 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/cart">Giỏ hàng</Breadcrumb.Item>
                                <Breadcrumb.Item>Thanh toán</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card bordered={false} style={{ borderRadius: 3 }}>

                                    <Form form={form} onFinish={handleSubmit}>
                                        <h2 style={{ marginTop: -10, marginBottom: 10 }}>Thanh toán</h2>
                                        <div>

                                            <ProFormText
                                                name="name"
                                                placeholder="Họ và tên"
                                                fieldProps={{
                                                    style: {
                                                        height: 50,
                                                        fontSize: 16,
                                                    }
                                                }}
                                            />
                                            <ProFormText
                                                name="phone"
                                                placeholder="Số điện thoại"
                                                fieldProps={{
                                                    style: {
                                                        height: 50,
                                                        fontSize: 16,
                                                        margin: 0,
                                                    }
                                                }}
                                            />
                                            <ProForm.Item name="address">
                                                <AddressSelector
                                                    onChange={(value: string[]) => form.setFieldsValue({ address: value })}
                                                />
                                            </ProForm.Item>
                                        </div>
                                        <div style={{ paddingTop: 10 }}>
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
                                                <p style={{ fontSize: 18, margin: "5 0" }}>Giá giảm:</p>
                                                <p style={{ fontSize: 18, margin: "5 0" }}>0đ</p>
                                            </div>
                                            <Divider style={{ margin: "5px 0" }} />
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

                                        <h3 style={{ marginTop: 10 }}>Mã khuyến mãi</h3>
                                        <Input
                                            placeholder="Nhập mã khuyến mãi"
                                            style={{ marginBottom: "10px", marginTop: 3 }}
                                            prefix={
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img
                                                        src={`${backendUrl}/storage/slide/discount.png`}
                                                        alt="Voucher"
                                                        style={{ width: 18, height: 18, marginRight: 5 }}
                                                    />
                                                </div>}
                                        />
                                        <h3 style={{ marginTop: 10 }}>Phương thức thanh toán</h3>
                                        <Radio.Group
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            value={paymentMethod}
                                            style={{ display: 'flex', flexDirection: 'row', gap: 12 }}
                                        >
                                            <Radio value="cod" style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src={`${backendUrl}/storage/slide/cod.svg`}
                                                        alt="COD"
                                                        style={{ width: 35, height: 55, objectFit: 'contain', marginRight: 10 }}
                                                    />
                                                    <span
                                                        style={{
                                                            fontWeight: 500,
                                                            color: '#555',
                                                        }}
                                                    >
                                                        Thanh toán khi nhận hàng
                                                    </span>
                                                </div>
                                            </Radio>

                                            <Radio value="vnpay" style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                                                <img
                                                    src={`${backendUrl}/storage/slide/vnpnoo1.svg`}
                                                    alt="COD"
                                                    style={{ width: 35, height: 55, marginRight: 8 }}
                                                />
                                                <div style={{ position: 'relative', display: 'inline-block', paddingTop: 12 }}>
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            textAlign: 'center',
                                                            fontWeight: 500,
                                                            color: '#555',
                                                        }}
                                                    >
                                                        Thanh toán VNPay
                                                    </span>
                                                    <img
                                                        src={`${backendUrl}/storage/slide/vnpno2.svg`}
                                                        alt="VNPay"
                                                        style={{ height: 40, width: 120 }}
                                                    />
                                                </div>
                                            </Radio>

                                        </Radio.Group>

                                        <Button type="primary" block htmlType="submit"
                                            style={{ backgroundColor: "black", fontFamily: "'Geologica', sans-serif", height: 40, borderRadius: 2, marginTop: 20 }}>
                                            HOÀN TẤT ĐƠN HÀNG
                                        </Button>
                                        <Button type="link" block style={{
                                            color: "black", fontSize: 15, marginTop: 8, fontFamily: "'Geologica', sans-serif"
                                        }} onClick={() => navigate('/cart')}>
                                            <img
                                                src={`${backendUrl}/storage/slide/back.png`}
                                                style={{ width: 18, height: 14, marginRight: 5 }}
                                            />     Quay lại giỏ hàng</Button>
                                    </Form>
                                </Card>
                            </Col>
                            <Col xs={24} md={12} >
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
                                            <h2 style={{ margin: 0 }}>Thông tin đơn hàng:</h2>
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
                                        <Divider style={{ margin: "5px 0" }} />
                                        {cartItems.map((item, index) => (
                                            <Row key={item.id} style={{ marginTop: 25, alignItems: "start" }}>
                                                {/* Ảnh sản phẩm */}
                                                <Col span={6}>
                                                    <img
                                                        src={`${backendUrl}/storage/product/${item.productImage}`}
                                                        alt="Sản phẩm"
                                                        style={{ width: "100%", borderRadius: "2px", height: "120px" }}
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
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <p style={{ fontWeight: "500" }}> Số lượng:</p>
                                                            <span style={{ fontSize: "16px", color: "black", fontWeight: "700" }}>
                                                                {item.quantity}
                                                            </span>
                                                        </div>
                                                        <h3 style={{ margin: 0 }}>
                                                            {(item.price * item.quantity).toLocaleString()}đ
                                                        </h3>
                                                    </Col>
                                                </Col>
                                                <Divider style={{ margin: "5px 0" }} />
                                            </Row>
                                        ))}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row >
            </div >
        </>
    );
}
export default CheckOutPage;