import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Badge, Typography, Input, Row, Col, Flex, Affix } from "antd";
import { HomeOutlined, AppstoreOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined, MailOutlined, EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { Header } from "antd/lib/layout/layout";

interface User {
    name: string;
    avatar: string;
    isAuthenticated: boolean;
    cartQuantity: number;
    adminMessageCount: number;
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User>({
        name: "Admin",
        avatar: "/images/avatar/default.png",
        isAuthenticated: true,
        cartQuantity: 2,
        adminMessageCount: 5,
    });

    const handleLogout = () => {
        setUser({ ...user, isAuthenticated: false });
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/user/account-management">
                    <UserOutlined /> Quản lý tài khoản
                </Link>
            </Menu.Item>
            <Menu.Item key="history">
                <Link to="/user/order-history">Lịch sử mua hàng</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Affix offsetTop={0}>
            <Row className="fixed-navbar" style={{ width: "100%", background: "black" }}>
                {/* Top Info */}
                <Row align="middle" style={{ padding: "10px", background: "#f5f5f5", width: "100%", height: "40px" }}>
                    <Col xs={24} sm={4} style={{ textAlign: "left", margin: "0 8px" }}>
                        <Typography.Text strong>
                            <EnvironmentOutlined style={{ marginRight: "8px", color: "#808080" }} />
                            <a href="#" style={{ color: "black" }}>132 Nguyên Xá, Cầu Diễn</a>
                        </Typography.Text>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: "left" }}>
                        <Typography.Text strong>
                            <MailOutlined style={{ marginRight: "8px", color: "#808080" }} />
                            <a href="mailto:congquach34@gmail.com" style={{ color: "black" }}>congquach34@gmail.com</a>
                        </Typography.Text>
                    </Col>
                </Row>

                {/* Header */}
                <Row align="middle" justify="space-between" style={{ background: "black", padding: "0 20px", height: "75px", width: "100%" }}>
                    <Col xs={24} sm={4} md={4} lg={4} style={{ marginLeft: "60px" }}>
                        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                            <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/slide/logo.jpg`} alt="Logo"
                                style={{ width: 170, height: 50, marginRight: 10 }} />
                        </Link>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            border: "2px solid black",
                            borderRadius: "8px",
                            overflow: "hidden",
                            width: "560px",
                            background: "white",
                            height: "43px"
                        }}>
                            <Input
                                placeholder="Bạn đang tìm gì..."
                                style={{
                                    border: "none",
                                    outline: "none",
                                    flex: 1,
                                    padding: "10px",
                                    fontSize: "16px",
                                }}
                            />
                            <div style={{
                                marginRight: "1px",
                                background: "black",
                                padding: "5px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                width: "80px",
                                height: "36px",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}>
                                <SearchOutlined style={{ fontSize: "24px", color: "white" }} />
                            </div>
                        </div>
                    </Col>
                    <Col xs={8} sm={6} md={4} lg={4} style={{ marginRight: "40px" }}>
                        <Row align="middle" justify="end" gutter={20} style={{ color: "white" }}>
                            {/* Liên hệ */}
                            <Col>
                                <Link to="/contact" style={{ color: "white" }}>
                                    <Flex vertical align="center">
                                        <EnvironmentOutlined style={{ fontSize: "24px" }} />
                                        <p style={{ marginTop: "11px" }}>Cửa hàng</p>
                                    </Flex>
                                </Link>
                            </Col>
                            {/* Giỏ hàng */}
                            <Col>
                                <Link to="/cart" style={{ color: "white" }}>
                                    <Flex vertical align="center">
                                        <Badge count={user.cartQuantity} offset={[0, 5]}>
                                            <ShoppingCartOutlined style={{ fontSize: "24px", color: "white" }} />
                                        </Badge>
                                        <p style={{ marginTop: "12px" }}>Giỏ hàng</p>
                                    </Flex>
                                </Link>
                            </Col>

                            {/* Tài khoản */}
                            <Col>
                                {user.isAuthenticated ? (
                                    <Dropdown overlay={userMenu} trigger={["click"]}>
                                        <Flex vertical align="center">
                                            <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/storage/slide/slide-1.webp`} />
                                            <p style={{ marginTop: "4px" }}>{user.name}</p>
                                        </Flex>
                                    </Dropdown>
                                ) : (
                                    <Link to="/login" style={{ color: "white" }}>Đăng nhập</Link>
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row >

                {/* Menu */}
                < Row justify="center" style={{ width: "100%", height: "40px" }}>
                    <Col span={24}>
                        <Menu mode="horizontal" style={{ flex: 1, justifyContent: "center", fontWeight: "bold" }}>
                            <Menu.Item key="home" icon={<HomeOutlined />}>
                                <Link to="/">Trang chủ</Link>
                            </Menu.Item>
                            <Menu.Item key="category" icon={<AppstoreOutlined />}>
                                <Link to="/categories">Danh mục sản phẩm</Link>
                            </Menu.Item>
                            <Menu.Item key="product" icon={<AppstoreOutlined />}>
                                <Link to="/products">Sản phẩm</Link>
                            </Menu.Item>
                            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                                <Link to="/cart">Giỏ hàng</Link>
                                <Badge count={user.cartQuantity} offset={[10, 0]} />
                            </Menu.Item>
                            <Menu.Item key="contact" icon={<MailOutlined />}>
                                <Link to="/user/contact">Liên hệ</Link>
                                <Badge count={user.adminMessageCount} offset={[10, 0]} />
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row >
            </Row >
        </Affix>
    );
};

export default Navbar;