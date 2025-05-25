import { LockOutlined, UserOutlined, MailOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    Form,
    Input,
    Row,
    Col,
    Select,
    message,
    notification,
    Card,
    Typography,
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "config/api";
import styles from "styles/auth.module.scss";
import { IUser } from "@/types/backend";
import AddressSelector from "@/components/admin/user/location.user";

const { Option } = Select;
const { Title } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    // Khai báo form instance để dùng setFieldsValue khi chọn địa chỉ
    const [form] = Form.useForm();

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address } = values;

        // Giả sử address là mảng string[]
        const formattedAddress = Array.isArray(address) ? address.join(", ") : String(address || "");

        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age!, gender, formattedAddress);
        setIsSubmit(false);

        if (res?.data?.id) {
            notification.success({
                message: "Thành Công",
                description: "Đăng ký tài khoản thành công!",
            }); navigate("/login");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh", background: "#f9f9f9" }}>
            <Col xs={22} sm={16} md={12} lg={8}>
                <Card
                    bordered={false}
                    style={{ borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.05)" }}
                >
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 5,
                                marginBottom: 5,
                            }}
                        >
                            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                                Đăng ký tài khoản
                            </Title>
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/slide/logo.jpg`}
                                alt="Logo"
                                style={{ width: "100px", borderRadius: 50, marginTop: 6 }}
                            />
                        </div>
                        <p style={{ marginBottom: 0, color: "#777" }}>Tạo tài khoản mới để bắt đầu</p>
                    </div>

                    <Form<IUser>
                        form={form}
                        name="register-form"
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Họ tên"
                            name="name"
                            rules={[{ required: true, message: "Họ tên không được để trống!" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Email không được để trống!" }]}
                        >
                            <Input prefix={<MailOutlined />} type="email" placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: "Tuổi không được để trống!" }]}
                        >
                            <Input type="number" placeholder="Nhập tuổi" />
                        </Form.Item>

                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: "Giới tính không được để trống!" }]}
                        >
                            <Select placeholder="Chọn giới tính" allowClear>
                                <Option value="Nam">
                                    <ManOutlined /> Nam
                                </Option>
                                <Option value="Nữ">
                                    <WomanOutlined /> Nữ
                                </Option>
                                <Option value="Khác">Khác</Option>
                            </Select>
                        </Form.Item>

                        {/* Thay phần Địa chỉ bằng AddressSelector */}
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: "Địa chỉ không được để trống!" }]}
                        >
                            <AddressSelector
                                onChange={(value: string[]) => {
                                    // Cập nhật giá trị address cho form
                                    form.setFieldsValue({ address: value });
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={isSubmit}
                                style={{ background: "black" }}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <Divider>Hoặc</Divider>

                        <p style={{ textAlign: "center" }}>
                            Đã có tài khoản?{" "}
                            <Link to="/login" style={{ color: "#1677ff" }}>
                                Đăng nhập
                            </Link>
                        </p>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;
