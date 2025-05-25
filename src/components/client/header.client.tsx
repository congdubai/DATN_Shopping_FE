import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Badge, Typography, Input, Row, Col, Flex, Affix, message, notification } from "antd";
import { HomeOutlined, AppstoreOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined, MailOutlined, EnvironmentOutlined, SearchOutlined, UnorderedListOutlined, DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import SubMenu from "antd/es/menu/SubMenu";
import { callFetchMenuCategory, callLogout } from "@/config/api";
import { ICategory } from "@/types/backend";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Navbar: React.FC = () => {
    const [quantity, setQuantity] = useState<number>(0);
    const [categoryItems, setCategoryItems] = useState<{ label: string, path: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);

    const convertCategoryToMenu = (data: ICategory[]) => {
        return data.map((cat) => ({
            label: cat.name,
            path: `/category/${cat.id}`,
        }));
    };
    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery.trim()}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await callFetchMenuCategory();
                if (res.data && Array.isArray(res.data)) {
                    const menu = convertCategoryToMenu(res.data);
                    setCategoryItems(menu);
                }
            } catch (error) {
                console.error("Lỗi khi fetch category:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const updateCartQuantity = () => {
            const storedQuantity = parseInt(localStorage.getItem("cart_quantity") || "0");
            setQuantity(storedQuantity);
        };

        window.addEventListener("cartQuantityChanged", updateCartQuantity);
        updateCartQuantity(); // gọi khi mount

        return () => {
            window.removeEventListener("cartQuantityChanged", updateCartQuantity);
        };
    }, []);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            notification.success({
                message: 'Thành công',
                description: 'Đăng xuất thành công!',
                placement: 'topRight',
            }); navigate('/login')
        }
    }
    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/profile">
                    <UserOutlined /> Quản lý tài khoản
                </Link>
            </Menu.Item>
            <Menu.Item key="history">
                <Link to="/order-history">Lịch sử mua hàng</Link>
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Bạn đang tìm gì..."
                                style={{
                                    border: "none",
                                    outline: "none",
                                    flex: 1,
                                    padding: "10px",
                                    fontSize: "16px",
                                }}
                            />
                            <div
                                style={{
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
                                }}
                                onClick={handleSearch}
                            >
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
                                        <img style={{ height: 24, width: 24, imageRendering: "crisp-edges" }} src={`${import.meta.env.VITE_BACKEND_URL}/storage/slide/location.png`} alt="Logo" />
                                        <p style={{ marginTop: "11px" }}>Cửa hàng</p>
                                    </Flex>
                                </Link>
                            </Col>
                            {/* Giỏ hàng */}
                            <Col>
                                <Link to="/cart" style={{ color: "white" }}>
                                    <Flex vertical align="center">
                                        <Badge count={quantity} offset={[0, 5]}>
                                            <ShoppingCartOutlined style={{ fontSize: "24px", color: "white" }} />
                                        </Badge>
                                        <p style={{ marginTop: "12px" }}>Giỏ hàng</p>
                                    </Flex>
                                </Link>
                            </Col>

                            {/* Tài khoản */}
                            <Col>
                                {isAuthenticated ? (
                                    <Dropdown overlay={userMenu} trigger={["click"]}>
                                        <Flex vertical align="center">
                                            {user.avatar ? (
                                                <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/storage/slide/${user.avatar}`} />
                                            ) : (
                                                <Avatar style={{ background: "white", color: "black", cursor: "pointer" }}> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                            )}
                                            <p style={{ marginTop: "4px" }}>{user.name}</p>
                                        </Flex>
                                    </Dropdown>
                                ) : (
                                    <Flex vertical align="center">
                                        <Link to="/login" style={{ color: "white" }}>
                                            <UserOutlined style={{ fontSize: "24px", color: "white" }} />
                                        </Link>
                                        <Link to="/login" style={{ marginTop: "12px", color: "white" }}>Đăng nhập </Link>
                                    </Flex>
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
                            <SubMenu key="category" icon={<AppstoreOutlined />} title="Danh mục sản phẩm">
                                {categoryItems.map((item) => (
                                    <Menu.Item key={item.path}>
                                        <Link to={item.path}>{item.label}</Link>
                                    </Menu.Item>
                                ))}
                            </SubMenu>
                            <Menu.Item key="product-male" icon={<CaretDownOutlined />}>
                                <Link to="/products/Nam">Đồ Nam</Link>
                            </Menu.Item>
                            <Menu.Item key="product-female" icon={<CaretDownOutlined />}>
                                <Link to="/products/Nữ">Đồ Nữ</Link>
                            </Menu.Item>
                            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                                <Link to="/cart">Giỏ hàng</Link>
                                <Badge count={quantity} offset={[10, 0]} />
                            </Menu.Item>
                            <Menu.Item key="contact" icon={<MailOutlined />}>
                                <Link to="/user/contact">Liên hệ</Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row >
            </Row >
        </Affix>
    );
};

export default Navbar;