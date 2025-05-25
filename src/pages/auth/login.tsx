import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Form,
    Input,
    Typography,
    Card,
    Row,
    Col,
    message,
    notification,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { callLogin, callAddToCart } from "@/config/api";
import { useAppSelector } from "@/redux/hooks";
import CryptoJS from "crypto-js";
import "@/styles/main.css"
const { Title } = Typography;
const SECRET_KEY = "my-secret-key"; // Nên đặt trong file .env nếu muốn bảo mật hơn

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const redirectPath = useAppSelector((state) => state.account.redirectPath);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const callback = params.get("callback");

    // Đọc email và giải mã mật khẩu từ localStorage nếu đã lưu
    const rememberedEmail = localStorage.getItem("remembered_email") || "";
    const encryptedPassword = localStorage.getItem("remembered_password") || "";
    let rememberedPassword = "";

    if (encryptedPassword) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
            rememberedPassword = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            rememberedPassword = "";
        }
    }

    const getCartFromLocalStorage = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        return cart;
    };

    const syncCartWithServer = async () => {
        const cart = getCartFromLocalStorage();
        try {
            for (const item of cart) {
                const { productId, colorId, sizeId, quantity } = item;
                await callAddToCart(productId, sizeId, colorId, quantity);
            }
            localStorage.removeItem("cart");
            notification.success({
                message: "Đồng bộ giỏ hàng",
                description: "Giỏ hàng đã được đồng bộ lên server!",
            });
        } catch (err) {
            console.error("Lỗi khi đồng bộ giỏ hàng:", err);
            notification.error({
                message: "Lỗi đồng bộ",
                description: "Có lỗi xảy ra khi đồng bộ giỏ hàng!",
            });
            throw err;
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        const res = await callLogin(values.email, values.password);
        setLoading(false);

        if (res?.data) {
            const { remember } = values;

            if (remember) {
                localStorage.setItem("remembered_email", values.email);
                const encryptedPassword = CryptoJS.AES.encrypt(values.password, SECRET_KEY).toString();
                localStorage.setItem("remembered_password", encryptedPassword);
            } else {
                localStorage.removeItem("remembered_email");
                localStorage.removeItem("remembered_password");
            }

            dispatch(setUserLoginInfo(res.data.user));
            await syncCartWithServer();

            const roleName = res.data.user?.role?.name;
            const isAdmin = roleName === "ADMIN";
            const isStaff = roleName === "STAFF";

            if (redirectPath) {
                window.location.href = redirectPath;
            } else if (isAdmin || isStaff) {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } else {
            message.error(
                res.message && Array.isArray(res.message)
                    ? res.message[0]
                    : res.message || "Đăng nhập thất bại!"
            );
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh", background: "#f9f9f9" }}>
            <Col xs={22} sm={16} md={12} lg={8}>
                <Card
                    bordered={false}
                    style={{ borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.05)" }}
                >
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 5,
                        }}>
                            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Đăng nhập</Title>
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/slide/logo.jpg`}
                                alt="Clothing Store Logo"
                                style={{ width: "100px", borderRadius: 50, marginTop: 6 }}
                            />
                        </div>
                        <p style={{ marginBottom: 0, color: "#777" }}>Chào mừng bạn quay trở lại!</p>
                    </div>

                    <Form
                        name="login-form"
                        initialValues={{
                            remember: true,
                            email: rememberedEmail,
                            password: rememberedPassword,
                        }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox className="custom-checkbox">Ghi nhớ đăng nhập</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" style={{ background: "black" }} htmlType="submit" block size="large" loading={loading}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <p style={{ textAlign: "center" }}>
                                Chưa có tài khoản?{" "}
                                <a href="/register" style={{ color: "#1677ff" }}>
                                    Đăng ký ngay
                                </a>
                            </p>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;
