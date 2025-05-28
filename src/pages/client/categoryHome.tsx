import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchProductByCategory } from "../../redux/slice/productSlide";
import { Card, Col, Pagination, Row, Typography, Tag } from "antd";
import { ShoppingOutlined, SearchOutlined, StarFilled } from "@ant-design/icons";
import HomeModal from "@/components/client/home/modal.home";
import { IProduct } from "@/types/backend";

const CategoryHomePage = () => {
    const { categoryId } = useParams<{ categoryId: string }>(); // Lấy categoryId từ URL
    const products = useAppSelector(state => state.product.result);
    const meta = useAppSelector(state => state.product.meta);
    const isFetching = useAppSelector(state => state.product.isFetching);
    const dispatch = useAppDispatch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { Title, Text } = Typography;
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IProduct | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchProductByCategory({
                categoryId,
                query: `page=${currentPage}&size=${pageSize}`
            }));
        }
    }, [dispatch, categoryId, currentPage]);

    return (
        <>
            <Row justify="center" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Col span={19} style={{ padding: "0 20px" }}>
                    <Row justify="center">
                        <Col span={24} style={{ marginTop: "160px", position: "relative" }}>
                            <img src={`${backendUrl}/storage/slide/banner.webp`} className="carousel-img" style={{ marginTop: 20 }} />
                        </Col>
                    </Row>

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
                                        <Tag
                                            className="new-tag"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 6px' }}
                                        >
                                            <span style={{ fontSize: 12, lineHeight: 1 }}>{product.avgRating!.toFixed(1)}<StarFilled style={{ marginLeft: 4 }} /></span>
                                        </Tag>

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
                            <div
                                style={{
                                    minHeight: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    marginLeft: 500,
                                    width: "100%"
                                }}
                            >
                                <h3>Không có sản phẩm nào.</h3>
                            </div>
                        )}
                    </div>

                    <Row justify="center" style={{ marginTop: 10, padding: 10, marginBottom: 15 }}>
                        {products.length > 0 && (
                            <Pagination
                                current={meta.page}
                                pageSize={meta.pageSize}
                                showSizeChanger
                                total={meta.total}
                                onChange={(page, size) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                showTotal={(total, range) => `${range[0]}-${range[1]} trên ${total} rows`}
                            />
                        )}
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

export default CategoryHomePage;
