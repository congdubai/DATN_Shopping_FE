import AddressSelector from "@/components/admin/user/location.user";
import { useLocalCart } from "@/components/client/cart/useLocalCart";
import {
    callPlaceOrder,
    callFetchProductDetailById,
    callAddToCart,
    callDeleteCartDetail,
    callUpdateQuantity
} from "@/config/api";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import {
    Button,
    Card,
    Col,
    Divider,
    Input,
    Row,
    Form,
    Radio,
    message,
    notification
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const CreateOrderPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { cartItems, updateQuantity, removeItem, setCartItems } = useLocalCart();
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const [searchId, setSearchId] = useState("");
    const [productDetail, setProductDetail] = useState<any>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const searchWrapperRef = useRef<HTMLDivElement>(null);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    useEffect(() => {
        updateCartData();
    }, []);

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

    const handleSearchProduct = async () => {
        if (!searchId) return;
        try {
            const res = await callFetchProductDetailById(searchId);
            if (res.data && res.statusCode === 200) {
                setProductDetail(res.data);
                setDropdownVisible(true);
            } else {
                message.error("Không tìm thấy sản phẩm.");
                setDropdownVisible(false);
            }
        } catch (error) {
            message.error("Lỗi khi tìm kiếm sản phẩm.");
            setDropdownVisible(false);
        }
    };

    const handleSubmit = async (values: any) => {
        const { name, phone, address } = values;
        const res = await callPlaceOrder(
            name,
            phone,
            "Tại cửa hàng",
            "COD_OFFLINE",
            totalPrice.toString()
        );

        if (res.statusCode === '200') {
            localStorage.removeItem("cart");
            localStorage.setItem("cart_quantity", "0");
            window.dispatchEvent(new Event("cartQuantityChanged"));
            await updateCartData();
            form.resetFields();
            notification.success({
                message: "Đặt hàng thành công",
                description: "Cảm ơn bạn đã mua hàng!",
                placement: "topRight"
            });
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            });
        }
    };
    const handleAddToCart = async () => {
        try {
            if (!productDetail) return;

            const productId = productDetail.product?.id;
            const sizeId = productDetail.size?.id;
            const colorId = productDetail.color?.id;

            await callAddToCart(productId, sizeId, colorId, "1");
            await updateCartData();
            message.success("Đã thêm vào giỏ hàng!");
            setDropdownVisible(false);
            setSearchId("");
        } catch (error) {
            message.error("Thêm vào giỏ hàng thất bại!");
        }
    };
    const handleDelete = async (productId: string, colorName: string, sizeName: string) => {
        const token = localStorage.getItem("access_token");

        const updateCartQuantity = () => {
            const currentQuantity = parseInt(localStorage.getItem("cart_quantity") || "0", 10);
            const newQuantity = Math.max(currentQuantity - 1, 0); // không bao giờ âm
            localStorage.setItem("cart_quantity", newQuantity.toString());
        };

        if (!token) {
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
    // Ẩn dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(event.target as Node)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
                marginTop: -20
            }}
        >
            <Row justify="center">
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={13}>
                            <Card bordered={false} style={{ borderRadius: 3 }}>
                                <Form form={form} onFinish={handleSubmit}>
                                    <h2 style={{ marginTop: -10, marginBottom: 10 }}>
                                        Thanh toán
                                    </h2>
                                    <ProFormText
                                        name="name"
                                        placeholder="Họ và tên"
                                        fieldProps={{ style: { height: 50, fontSize: 16 } }}
                                    />
                                    <ProFormText
                                        name="phone"
                                        placeholder="Số điện thoại"
                                        fieldProps={{ style: { height: 50, fontSize: 16 } }}
                                    />

                                    <Row gutter={16}>
                                        <Col lg={24} md={24} sm={24} xs={24}>
                                            <div ref={searchWrapperRef} style={{ position: "relative" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        border: "2px solid black",
                                                        borderRadius: "8px",
                                                        overflow: "hidden",
                                                        background: "white",
                                                        height: "43px"
                                                    }}
                                                >
                                                    <Input
                                                        value={searchId}
                                                        onChange={(e) => setSearchId(e.target.value)}
                                                        placeholder="Nhập mã sản phẩm ..."
                                                        style={{
                                                            border: "none",
                                                            outline: "none",
                                                            flex: 1,
                                                            padding: "10px",
                                                            fontSize: "16px"
                                                        }}
                                                    />
                                                    <div
                                                        onClick={handleSearchProduct}
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
                                                    >
                                                        <SearchOutlined
                                                            style={{ fontSize: "24px", color: "white" }}
                                                        />
                                                    </div>
                                                </div>

                                                {dropdownVisible && productDetail && (
                                                    <Card
                                                        hoverable
                                                        style={{
                                                            position: "absolute",
                                                            top: 50,
                                                            zIndex: 999,
                                                            width: "100%",
                                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                            paddingBottom: 50  // Đảm bảo có khoảng trống cho nút
                                                        }}
                                                        onClick={() => setDropdownVisible(false)}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <img
                                                                src={`${backendUrl}/storage/product/${productDetail.product?.image}`}
                                                                alt="Sản phẩm"
                                                                style={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    objectFit: "cover",
                                                                    borderRadius: 4,
                                                                    marginRight: 12
                                                                }}
                                                            />
                                                            <div>
                                                                <h4 style={{ margin: 0 }}>
                                                                    {productDetail.product?.name}
                                                                </h4>
                                                                <p style={{ margin: "4px 0" }}>
                                                                    Giá: {productDetail.product?.price?.toLocaleString()} đ
                                                                </p>
                                                                <p style={{ margin: "4px 0" }}>
                                                                    Size: {productDetail.size?.name} - Màu: {productDetail.color?.name}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                bottom: 10,
                                                                right: 10
                                                            }}
                                                        >
                                                            <Button
                                                                style={{ background: "black", color: "white" }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddToCart();
                                                                }}
                                                            >
                                                                Thêm vào giỏ
                                                            </Button>
                                                        </div>
                                                    </Card>

                                                )}
                                            </div>
                                        </Col>
                                    </Row>

                                    <div style={{ paddingTop: 20 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <p style={{ fontSize: 18, margin: 0 }}>Tạm tính:</p>
                                            <p style={{ fontSize: 18, margin: 0 }}>
                                                {totalPrice.toLocaleString()}đ
                                            </p>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 5
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
                                                alignItems: "center"
                                            }}
                                        >
                                            <p style={{ fontSize: 18, margin: 0 }}>Tổng tiền:</p>
                                            <h3 style={{ margin: 0 }}>
                                                {totalPrice.toLocaleString()}đ
                                            </h3>
                                        </div>
                                    </div>

                                    <h3 style={{ marginTop: 10 }}>Mã khuyến mãi</h3>
                                    <Input
                                        placeholder="Nhập mã khuyến mãi"
                                        style={{ marginBottom: "10px", marginTop: 3 }}
                                        prefix={
                                            <img
                                                src={`${backendUrl}/storage/slide/discount.png`}
                                                alt="Voucher"
                                                style={{ width: 18, height: 18, marginRight: 5 }}
                                            />
                                        }
                                    />

                                    <Button
                                        type="primary"
                                        block
                                        htmlType="submit"
                                        style={{
                                            backgroundColor: "black",
                                            fontFamily: "'Geologica', sans-serif",
                                            height: 40,
                                            borderRadius: 2,
                                            marginTop: 20
                                        }}
                                    >
                                        HOÀN TẤT ĐƠN HÀNG
                                    </Button>
                                </Form>
                            </Card>
                        </Col>

                        <Col xs={24} md={11}>
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
                                    {cartItems.length === 0 ? (
                                        <div style={{ padding: "20px 5px", fontSize: 16, fontFamily: "'Geologica', sans-serif" }}>
                                            Chưa có sản phẩm nào trong giỏ hàng.
                                        </div>
                                    ) : (

                                        cartItems.map((item, index) => (
                                            <Row key={index} style={{ marginTop: 25, alignItems: "start" }}>
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
                                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                            <Button
                                                                danger
                                                                onClick={() => {
                                                                    const newQuantity = item.quantity - 1;
                                                                    if (newQuantity > 0) {
                                                                        updateQuantity(item.productId, item.colorId, item.sizeId, newQuantity); // Cập nhật local
                                                                        callUpdateQuantity(String(item.id), String(newQuantity)) // Cập nhật server
                                                                            .then(() => updateCartData()) // reload lại giỏ hàng từ server
                                                                            .catch(err => console.error("Update quantity failed:", err));
                                                                    }
                                                                }}
                                                            >-</Button>

                                                            <span style={{ fontSize: "16px", color: "black", fontWeight: "700" }}>
                                                                {item.quantity}
                                                            </span>

                                                            <Button
                                                                danger
                                                                onClick={() => {
                                                                    const newQuantity = item.quantity + 1;
                                                                    updateQuantity(item.productId, item.colorId, item.sizeId, newQuantity); // Cập nhật local
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
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default CreateOrderPage;
