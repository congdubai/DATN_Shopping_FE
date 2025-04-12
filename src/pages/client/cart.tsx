import { CloseOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Divider, Input, Row } from "antd";

const CartPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
                                                1 Sản phẩm
                                            </a>
                                        </p>
                                    </Col>
                                    <Divider style={{ margin: "10px 0" }} />

                                    <Col span={24}>
                                        <div style={{ borderRadius: 5, backgroundColor: "#fcf4ec", padding: "8px 5px" }}>Bạn được <b>giảm 10%</b> tối đa 10K, mua đơn hàng trên 350,000₫ để giảm ngay 50K!</div>
                                    </Col>
                                    <Row style={{ marginTop: 25, alignItems: "start" }}>
                                        {/* Ảnh sản phẩm */}
                                        <Col span={6}>
                                            <img
                                                src={`${backendUrl}/storage/slide/slide-2.jpg`}
                                                alt="Sản phẩm"
                                                style={{ width: "100%", borderRadius: "2px" }}
                                            />
                                        </Col>

                                        {/* Thông tin sản phẩm */}
                                        <Col flex="1" style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
                                            <h3 style={{ margin: 0 }}>Áo Thun Nam ICONDENIM Baseball ICDN Star</h3>
                                            <p style={{ margin: "5px 0" }}>Size: S - Màu: Kem</p>

                                            {/* Số lượng và giá */}
                                            <Col
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                    marginTop: 8
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                    <Button danger>-</Button>
                                                    <span style={{ fontSize: "16px", color: "black", fontWeight: "700" }}>1</span>
                                                    <Button danger>+</Button>
                                                </div>
                                                <h3 style={{ margin: 0 }}>349,000đ</h3>
                                            </Col>
                                        </Col>

                                        <Col span={4} style={{ textAlign: "right" }}>
                                            <img
                                                src={`${backendUrl}/storage/slide/close.png`}
                                                style={{ width: 12, height: 12 }}
                                            />                                        </Col>
                                    </Row>
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
                                        <p style={{ fontSize: 18, margin: 0 }}>349,000đ</p>
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
                                        <h3 style={{ margin: 0 }}>349,000đ</h3>
                                    </div>
                                </div>

                                <h3 style={{ marginTop: 10 }}>Ghi chú đơn hàng</h3>
                                <Input.TextArea placeholder="Ghi chú" style={{ marginBottom: "10px" }} />
                                <h3>Mã khuyến mãi</h3>
                                <Input
                                    placeholder="Nhập mã khuyến mãi"
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


                                <Button type="primary" block style={{ backgroundColor: "black", fontFamily: "'Geologica', sans-serif", height: 40, borderRadius: 2, marginTop: 15 }}>
                                    THANH TOÁN NGAY
                                </Button>
                                <Button type="link" block style={{
                                    color: "black", fontSize: 15, marginTop: 8, fontFamily: "'Geologica', sans-serif"
                                }}>
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
