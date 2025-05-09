import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchProduct } from "../../redux/slice/productSlide";
import { Button, Card, Carousel, Col, notification, Pagination, Rate, Row, Tag, Typography } from "antd";
import "styles/main.css"
import { CarouselRef } from "antd/es/carousel";
import { CarOutlined, CopyOutlined, EyeOutlined, LeftOutlined, RightOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import HomeModal from "@/components/client/home/modal.home";
import { IProduct } from "@/types/backend";
import { callVNPayReturn } from "@/config/api";

const HomePage = () => {
    const products = useAppSelector(state => state.product.result);
    const meta = useAppSelector(state => state.product.meta);
    const isFetching = useAppSelector(state => state.product.isFetching);
    const dispatch = useAppDispatch();
    const images = ["slide-1.webp", "slide-2.jpg", "slide-3.webp", "slide-4.webp"];
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { Title, Text } = Typography;
    const carouselRef = useRef<CarouselRef>(null);
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IProduct | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const alreadyCalled = useRef(false);


    const coupons = [
        {
            code: "HE10",
            discount: "GIẢM 10%",
            description: "giảm 10% (tối đa 10K)",
            expiry: "31/03/2025",
        },
        {
            code: "HE50",
            discount: "GIẢM 50K",
            description: "đơn từ 699K (số lượng có hạn)",
            expiry: "31/03/2025",
        },
        {
            code: "HE80",
            discount: "GIẢM 80K",
            description: "đơn từ 999K (số lượng có hạn)",
            expiry: "31/03/2025",
        },
    ];

    useEffect(() => {
        const handleVNPayReturn = async () => {
            const params = new URLSearchParams(location.search);
            const responseCode = params.get("vnp_ResponseCode");
            const txnRef = params.get("vnp_TxnRef");

            const key = `payment-handled-${txnRef}`;
            const isHandled = sessionStorage.getItem(key);

            if (!responseCode || !txnRef || isHandled) return;

            try {
                sessionStorage.setItem(key, "true");

                const res = await callVNPayReturn(responseCode, txnRef);

                if (res.statusCode === 200) {
                    localStorage.removeItem("cart");
                    localStorage.setItem("cart_quantity", "0");
                    window.dispatchEvent(new Event("cartQuantityChanged"));

                    notification.success({
                        message: 'Đặt hàng thành công',
                        description: 'Cảm ơn bạn đã mua hàng!',
                        placement: 'topRight',
                    });
                } else {
                    notification.error({ message: 'Có lỗi xảy ra' });
                }
            } catch (err) {
                notification.error({ message: "Lỗi khi xác nhận thanh toán" });
            } finally {
                // 👇 Dọn URL để không bị gọi lại lần sau
                navigate("/", { replace: true });
            }
        };

        handleVNPayReturn();
    }, [location.search]);


    useEffect(() => {
        dispatch(fetchProduct({ query: `page=${currentPage}&size=${pageSize}` }));
    }, [dispatch, currentPage]);
    return (
        <>
            <Row justify="center" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Col span={19} style={{ padding: "0 20px" }}>
                    <Row justify="center">
                        <Col className="carousel-container" span={24} style={{ marginTop: "170px", position: "relative" }}>
                            <Carousel autoplay dots ref={carouselRef}>
                                {images.map((img, index) => (
                                    <div key={index} className="carousel-item">
                                        <img
                                            src={`${backendUrl}/storage/slide/${img}`}
                                            alt={`Slide ${index + 1}`}
                                            className="carousel-img"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            <button className="custom-arrow prev" onClick={() => carouselRef.current?.prev()}>
                                <img style={{ height: 35, width: 16, transform: "scaleX(-1)" }} src={`${backendUrl}/storage/slide/prev.png`}></img>
                            </button>
                            <button className="custom-arrow next" onClick={() => carouselRef.current?.next()}>
                                <img style={{ height: 35, width: 16 }} src={`${backendUrl}/storage/slide/next.png`}></img>
                            </button>
                        </Col>

                    </Row>

                    {/**discount */}
                    <div className="discount-container">
                        <h3 className="discount-title">ƯU ĐÃI DÀNH CHO BẠN</h3>
                        <Row align="middle">
                            {coupons.map((coupon) => (
                                <Col key={coupon.code} xs={24} sm={12} md={8} lg={6}>
                                    <Card className="discount-card" bodyStyle={{ display: "flex", padding: "0" }}>
                                        <div className="discount-code">{coupon.code}</div>
                                        <div className="discount-content">
                                            <h4 className="discount-text">{coupon.discount}</h4>
                                            <p className="discount-desc">{coupon.description}</p>
                                            <div className="discount-footer">
                                                <div>
                                                    <p className="discount-meta"><strong>Mã:</strong> <strong>{coupon.code}</strong></p>
                                                    <p className="discount-meta"><strong>HSD:</strong> {coupon.expiry}</p>
                                                </div>
                                                <Button icon={<CopyOutlined />} type="default" size="small" className="copy-button">Sao chép mã</Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Card className="freeship-card">
                                    <div className="freeship-header">
                                        <h3 className="freeship-title">FREESHIP</h3>
                                        <img
                                            src={`${backendUrl}/storage/slide/free.png`}
                                            alt="Truck Icon"
                                            className="freeship-icon"
                                        />
                                    </div>
                                    <p className="freeship-desc">ĐƠN HÀNG TỪ <strong style={{ fontSize: 20 }}>399K</strong></p>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    {/**banner */}
                    <Row justify="center">
                        <Col span={24}>
                            <img src={`${backendUrl}/storage/slide/banner.webp`} className="carousel-img" style={{ marginTop: 20 }} />
                        </Col>
                    </Row>

                    {/* Danh sách sản phẩm */}
                    <div className="product-grid">
                        {isFetching ? (
                            <p>Đang tải sản phẩm...</p>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <Card
                                    key={product.id}
                                    className="product-card"
                                    hoverable
                                    bodyStyle={{ padding: 5 }}
                                >
                                    <div className="product-image-container">
                                        <img
                                            src={`${backendUrl}/storage/product/${product.image}`}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                        <Tag className="new-tag">Hàng Mới</Tag>

                                        <div className="cart-icon" onClick={() => {
                                            setDataInit(product);
                                            setIsOpenModal(true);
                                        }}>
                                            <ShoppingOutlined />
                                            <span className="cart-text">Thêm vào giỏ</span>
                                        </div>

                                        <div className="search-icon" onClick={() => {
                                            setDataInit(product);
                                            navigate(`/product-detail/${product.id}`);
                                        }}>
                                            <SearchOutlined />
                                        </div>
                                    </div>
                                    <Title level={5} className="product-title">{product.name}</Title>
                                    <Text strong className="product-price">{product.price} <sup className="product-currency">đ</sup></Text>
                                </Card>

                            ))
                        ) : (
                            <p>Không có sản phẩm nào để hiển thị.</p>
                        )}
                    </div>

                    {/* Pagination */}
                    <Row justify="center" style={{ marginTop: 10, padding: 10, marginBottom: 15 }}>
                        <Pagination
                            current={meta.page}
                            pageSize={meta.pageSize}
                            showSizeChanger
                            total={meta.total}
                            showTotal={(total, range) => `${range[0]}-${range[1]} trên ${total} rows`}
                            onChange={(page) => {
                                setCurrentPage(page);
                                dispatch(fetchProduct({ query: `page=${page}&size=${pageSize}` })); // Gọi lại API để tải sản phẩm cho trang mới
                            }}
                        />
                    </Row>
                </Col>
            </Row>
            <HomeModal
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                productId={dataInit?.id}
            />

        </>
    );
};

export default HomePage;
