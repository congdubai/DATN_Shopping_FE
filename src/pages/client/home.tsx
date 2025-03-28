import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchProduct } from "../../redux/slice/productSlide";
import { Button, Card, Carousel, Col, Row, Tag, Typography } from "antd";
import "styles/main.css"
import { CarouselRef } from "antd/es/carousel";
import { CarOutlined, CopyOutlined, EyeOutlined, LeftOutlined, RightOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";

const HomePage = () => {
    const products = useAppSelector(state => state.product.result);
    const meta = useAppSelector(state => state.product.meta);
    const isFetching = useAppSelector(state => state.product.isFetching);
    const dispatch = useAppDispatch();
    const images = ["slide-1.webp", "slide-2.jpg", "slide-3.webp", "slide-4.webp"];
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { Title, Text } = Typography;
    const carouselRef = useRef<CarouselRef>(null);
    const navigate = useNavigate(); // Hook điều hướng
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
        dispatch(fetchProduct({ query: "page=1&size=8" }));
    }, [dispatch]); // Gọi API khi component render

    return (
        <Row justify="center">
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
                                onClick={() => navigate(`/product/detail?id=${product.id}`)}
                                bodyStyle={{ padding: 5 }}
                            >
                                <div className="product-image-container">
                                    <img
                                        src={`${backendUrl}/storage/product/${product.image}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                    <Tag className="new-tag">Hàng Mới</Tag>
                                    <div className="cart-icon">
                                        <ShoppingOutlined />
                                    </div>
                                    {/* Icon tìm kiếm ẩn, chỉ hiển thị khi hover */}
                                    <div className="search-icon">
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
                <Row justify="center" className="mt-4">
                    {Array.from({ length: meta.pages || 1 }, (_, i) => (
                        <Col key={i}>
                            <Link to={`?page=${i}&size=8`} className={meta.page === i ? "active" : ""}>
                                {i + 1}
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
};

export default HomePage;
