import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Button, Card, Col, Row, Slider, Tag, Typography } from "antd";
import { SearchOutlined, ShoppingOutlined } from "@ant-design/icons";
import HomeModal from "@/components/client/home/modal.home";
import { IProduct } from "@/types/backend";
import { callFetchCategory, callFetchColor, callFetchProductsBySearch, callFetchProductsBySearchQuery } from "@/config/api";
import { IProductSelect } from "@/components/admin/product/modal.product";
import { ProForm } from "@ant-design/pro-components";
import { DebounceSelect } from "@/components/admin/user/debouce.select";

const HomeSearchPage = () => {
    const isFetching = useAppSelector(state => state.product.isFetching);
    const dispatch = useAppDispatch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { Title, Text } = Typography;
    const navigate = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IProduct | null>(null);
    const [products, setProducts] = useState<IProduct[] | null>(null);
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("query");
    const [categories, setCategories] = useState<IProductSelect[]>([]);
    const [colors, setColors] = useState<IProductSelect[]>([]);

    const alreadyCalled = useRef(false);
    const [filter, setFilter] = useState<{
        category: string | null;
        priceRange: number[];
        colors: string[];
        rating: number | undefined;
    }>({
        category: null,
        priceRange: [0, 1000000],
        colors: [],
        rating: undefined,
    });

    const applyFilters = () => {
        const fetchFilteredProducts = async () => {
            try {
                const queryParam = new URLSearchParams(search).get("query");

                if (!queryParam) {
                    console.error("Không có giá trị query trong URL.");
                    return;  // Hoặc có thể gán giá trị mặc định cho queryParam
                }

                const query = `name=${encodeURIComponent(queryParam)}` +
                    `&category=${encodeURIComponent(filter.category || '')}` +
                    `&priceRange=${encodeURIComponent(filter.priceRange[0] + '-' + filter.priceRange[1])}` +
                    `&colors=${encodeURIComponent(filter.colors.join(','))}` +
                    `&rating=${encodeURIComponent(filter.rating || '')}`;

                // Gọi API với query đã được xây dựng
                const res = await callFetchProductsBySearchQuery(query);
                setProducts(res.data!);
            } catch (error) {
                console.error("Error fetching filtered products:", error);
            }
        };

        fetchFilteredProducts();
    };



    async function fetchColorList(name: string): Promise<IProductSelect[]> {
        const res = await callFetchColor(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            return list.map(item => ({
                key: item.id,
                label: item.name as string,
                value: item.id as string,
            }));
        }
        return [];
    }

    async function fetchCategoryList(name: string): Promise<IProductSelect[]> {
        const res = await callFetchCategory(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            return list.map(item => ({
                key: item.id,
                label: item.name as string,
                value: item.id as string,
            }));
        }
        return [];
    }

    useEffect(() => {
        const fetchProducts = async () => {
            if (query) {
                try {
                    const res = await callFetchProductsBySearch(query);
                    setProducts(res.data!);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            }
        };

        fetchProducts();
    }, [query]);

    return (
        <>
            <Row justify="end" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", marginTop: 0, position: "relative" }}>
                <Col span={7} style={{ padding: "0 20px", background: "white", marginTop: 170, marginBottom: 90, height: '500' }}>
                    <Title level={4} style={{ marginTop: 10 }}>Bộ lọc sản phẩm</Title>

                    {/* Thể loại sản phẩm */}
                    <div style={{ marginBottom: 24 }}>
                        <Text strong>Thể loại</Text>
                        <ProForm.Item
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            style={{ marginTop: 5 }}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={categories}
                                value={categories}
                                placeholder="Chọn danh mục"
                                fetchOptions={fetchCategoryList}
                                onChange={(newValue: any) => {
                                    if (newValue && newValue.value) {
                                        setCategories(newValue as IProductSelect[]);
                                        setFilter({ ...filter, category: newValue.value });
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </div>

                    {/* Giá */}
                    <div style={{ marginBottom: 24 }}>
                        {filter.priceRange && (
                            <div style={{ marginTop: 8 }}>
                                <Text strong>
                                    {`Khoảng giá: ${filter.priceRange[0].toLocaleString()} đ - ${filter.priceRange[1].toLocaleString()} đ`}
                                </Text>
                            </div>
                        )}
                        <Slider
                            range
                            defaultValue={[0, 1000000]}
                            max={2000000}
                            step={50000}
                            onAfterChange={(value) => setFilter({ ...filter, priceRange: value })}
                        />
                    </div>

                    <Col span={12}>
                        <div style={{ marginBottom: 24 }}>
                            <Text strong>Màu sắc</Text>
                            <ProForm.Item name="color" style={{ marginTop: 5 }}>
                                <DebounceSelect
                                    allowClear
                                    mode="multiple"
                                    showSearch
                                    placeholder="Chọn màu sắc"
                                    value={colors}
                                    fetchOptions={fetchColorList}
                                    onChange={(newValue: any) => {
                                        setColors(newValue);
                                        setFilter({ ...filter, colors: newValue.map((c: IProductSelect) => c.value) });
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </div>
                    </Col>

                    {/* Đánh giá */}
                    <div style={{ marginBottom: 24 }}>
                        <Text strong>Đánh giá</Text>
                        <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={filter.rating}
                            tooltipVisible
                            marks={{
                                1: "1 sao",
                                2: "2 sao",
                                3: "3 sao",
                                4: "4 sao",
                                5: "5 sao",
                            }}
                            onChange={(value) => {
                                setFilter({ ...filter, rating: value });
                            }}
                        />

                    </div>

                    <Button onClick={applyFilters} style={{ width: "100%", background: "black", color: "white", marginTop: 20 }}>
                        Áp dụng bộ lọc
                    </Button>
                </Col>

                <Col span={16} style={{ padding: "0 20px", marginRight: 20, marginTop: 145 }}>
                    {/* Danh sách sản phẩm */}
                    <div className="product-grid1">
                        {isFetching ? (
                            <h4 style={{ marginLeft: 50, marginTop: 10 }}>Đang tải sản phẩm...</h4>
                        ) : products?.length! > 0 ? (
                            products?.map((product) => (
                                <Card key={product.id} className="product-card" hoverable bodyStyle={{ padding: 5 }}>
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

export default HomeSearchPage;
