import { CSSProperties, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Alert, Button, ButtonProps, Col, ConfigProvider, DatePicker, Flex, Image, Popover, Row, Space, Table, Tag, TagProps, Typography } from 'antd';
import { ArrowUpOutlined, QuestionOutlined, StarFilled } from '@ant-design/icons';
import useFetchData from '@/redux/useFetchData';
import { useStylesContext } from '@/context';
import { Card } from '@/components/admin/dashboard/Card/Card';
import { RevenueCard } from '@/components/admin/dashboard/RevenueCard/RevenueCard';
import "@/styles/dashboard.css"
import { callFetchCountCancelOrdersByDay, callFetchCountOrdersByDay, callFetchCountUsersByDay, callFetchCurrentOrder, callFetchITopSellerByDay, callFetchSlowSellingProducts, callFetchTopSellingProducts, callFetchTotalPriceByDay } from '@/config/api';
import SalesChart from '@/components/admin/dashboard/chart/SalesChart';
import CategoriesChart from '@/components/admin/dashboard/chart/CategoriesChart';
import { ORDERS_COLUMNS, SELLER_COLUMNS } from '@/components/admin/dashboard/Columns';
import { useAppSelector } from '@/redux/hooks';
import { IOrder, ITopProduct, ITopSeller } from '@/types/backend';
import { ColumnsType } from 'antd/lib/table/interface';
import ViewTopProductDetail from '@/components/admin/dashboard/product/view.topProduct';
import dayjs from 'dayjs';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const { RangePicker } = DatePicker;

export const COLOR = {
    50: '#e0f1ff',
    100: '#b0d2ff',
    200: '#7fb0ff',
    300: '#4d8bff',
    400: '#1e79fe',
    500: '#076ee5',
    600: '#0062b3',
    700: '#004f81',
    800: '#003650',
    900: '#001620',
    borderColor: '#E7EAF3B2',
};

const { Text, Title } = Typography;

const POPOVER_BUTTON_PROPS: ButtonProps = {
    type: 'text',
};

const cardStyles: CSSProperties = {
    height: '100%',
};

export const DashboardPage = () => {
    const stylesContext = useStylesContext();
    const [countUser, setCountUser] = useState<number>(0);
    const [countOrder, setCountOrder] = useState<number>(0);
    const [countCancelOrder, setCountCancelOrder] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const roleName = useAppSelector(state => state.account.user.role.name);
    const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
    const [recentOrdersLoading, setRecentOrdersLoading] = useState<boolean>(false);
    const [recentOrdersError, setRecentOrdersError] = useState<any>(null);
    const [topProducts, setTopProducts] = useState<ITopProduct[]>([]);
    const [topProductsLoading, setTopProductsLoading] = useState(false);
    const [topProductsError, setTopProductsError] = useState<any>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [productID, setProductId] = useState<string | null>(null);
    const [topSellers, setTopSellers] = useState<ITopSeller[]>([]);
    const [topSellersLoading, setTopSellersLoading] = useState<boolean>(false);
    const [topSellersError, setTopSellersError] = useState<string | null>(null);
    const [slowProducts, setSlowProducts] = useState<ITopProduct[]>([]);
    const [slowProductsLoading, setSlowProductsLoading] = useState(false);
    const [slowProductsError, setSlowProductsError] = useState<any>(null);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange1, setDateRange1] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange2, setDateRange2] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange3, setDateRange3] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange4, setDateRange4] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange5, setDateRange5] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange6, setDateRange6] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    const [dateRange7, setDateRange7] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const [start, end] = dateRange2;
                const res = await callFetchCountUsersByDay(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setCountUser(res.data!);
            } catch (error) {
                console.error('Lỗi khi lấy số người dùng:', error);
            }
        };

        fetchUserCount();
    }, [dateRange2]);

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const [start, end] = dateRange3;
                const res = await callFetchCountOrdersByDay(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setCountOrder(res.data!);
            } catch (error) {
                console.error('Lỗi khi lấy số đơn hàng:', error);
            }
        };

        fetchOrderCount();
    }, [dateRange3]);

    useEffect(() => {
        const fetchCancelOrderCount = async () => {
            try {
                const [start, end] = dateRange4;
                const res = await callFetchCountCancelOrdersByDay(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setCountCancelOrder(res.data!);
            } catch (error) {
                console.error('Lỗi khi lấy số đơn hủy:', error);
            }
        };

        fetchCancelOrderCount();
    }, [dateRange4]);

    useEffect(() => {
        const fetchTotalRevenue = async () => {
            try {
                const [start, end] = dateRange5;
                const res = await callFetchTotalPriceByDay(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setTotalPrice(res.data!);
            } catch (error) {
                console.error('Lỗi khi lấy doanh thu:', error);
            }
        };

        fetchTotalRevenue();
    }, [dateRange5]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                setRecentOrdersLoading(true);
                const res = await callFetchCurrentOrder('');
                if (res && res.data) {
                    setRecentOrders(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch recent orders:', error);
                setRecentOrdersError(error);
            } finally {
                setRecentOrdersLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    useEffect(() => {
        const fetchTopProducts = async () => {
            setTopProductsLoading(true);
            try {
                const [start, end] = dateRange;
                const res = await callFetchTopSellingProducts(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setTopProducts(res.data!);
            } catch (error: any) {
                setTopProductsError(error);
            } finally {
                setTopProductsLoading(false);
            }
        };

        fetchTopProducts();
    }, [dateRange1]);

    useEffect(() => {
        const fetchSlowProducts = async () => {
            setSlowProductsLoading(true);
            try {
                const [start, end] = dateRange1;
                const res = await callFetchSlowSellingProducts(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setSlowProducts(res.data!);
            } catch (error: any) {
                setSlowProductsError(error);
            } finally {
                setSlowProductsLoading(false);
            }
        };

        fetchSlowProducts();
    }, [dateRange]);


    useEffect(() => {
        const fetchTopSellers = async () => {
            const [start, end] = dateRange7;
            try {
                setTopSellersLoading(true);
                const res = await callFetchITopSellerByDay(start.startOf('day').toISOString(),
                    end.endOf('day').toISOString());
                setTopSellers(res.data!);
            } catch (err: any) {
                setTopSellersError(err.message || 'Đã có lỗi xảy ra');
            } finally {
                setTopSellersLoading(false);
            }
        };

        fetchTopSellers();
    }, [dateRange7]);

    const PRODUCTS_COLUMNS: ColumnsType<ITopProduct> = [
        {
            title: "Sản phẩm",
            dataIndex: "productName",
            key: "productName",
            render: (_: any, { productName, productImage, productId }: ITopProduct) => (
                <Flex gap="small" align="center" onClick={() => {
                    setOpenDrawer(true);
                    setProductId(productId!);
                }}>
                    <Image src={`${backendUrl}/storage/product/${productImage}`} width={35} height={35} />
                    <Text style={{ width: 160 }} ellipsis>
                        {productName}
                    </Text>
                </Flex>
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "totalQuantitySold",
            key: "totalQuantitySold",
            align: 'center',
            render: (totalQuantitySold: number) => <span className="text-capitalize">{totalQuantitySold}</span>,
        },
        {
            title: "Giá",
            dataIndex: "productPrice",
            key: "productPrice",
            align: 'center',
            render: (productPrice: number) => <span>{productPrice.toLocaleString()} ₫</span>,
        },
        {
            title: "Đánh giá",
            dataIndex: "averageRating",
            key: "averageRating",
            align: 'center',
            render: (rating: number) => (
                <Row justify="center" align="middle" gutter={[8, 0]}>
                    <Col>{rating}</Col>
                    <Col><StarFilled style={{ fontSize: 12, color: "#fadb14" }} /></Col>
                </Row>
            ),
        },
    ];
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: COLOR['500'],
                        borderRadius: 6,
                        fontFamily: 'Lato, sans-serif',
                    },
                    components: {
                        Button: {
                            colorLink: COLOR['500'],
                            colorLinkActive: COLOR['700'],
                            colorLinkHover: COLOR['300'],
                        },
                        Card: {
                            colorBorderSecondary: COLOR['borderColor'],
                        },
                        Table: {
                            borderColor: COLOR['100'],
                            colorBgContainer: 'none',
                            headerBg: 'none',
                            rowHoverBg: COLOR['50'],
                        },
                    },
                }}
            >
                <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
                    <Row
                        gutter={[
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                            { xs: 8, sm: 16, md: 24, lg: 32 },
                        ]}
                        style={{
                            borderRadius: 6,
                            fontFamily: 'Lato, sans-serif',
                        }}
                    >
                        {roleName === 'STAFF' ? (
                            <Col span={24}>
                                <Card title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ margin: 0 }}>Top nhân viên</span>
                                        <RangePicker
                                            value={dateRange7}
                                            onChange={(dates) => {
                                                if (dates) setDateRange7(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                            }}
                                            format="DD/MM/YYYY"
                                            allowClear={false}
                                        />
                                    </div>
                                }>
                                    {topSellersError ? (
                                        <Alert
                                            message="Error"
                                            description={topSellersError.toString()}
                                            type="error"
                                            showIcon
                                        />
                                    ) : (
                                        <Table
                                            columns={SELLER_COLUMNS}
                                            dataSource={topSellers}
                                            loading={topSellersLoading}
                                            className="overflow-scroll"
                                        />
                                    )}
                                </Card>
                            </Col>
                        ) : (
                            <>
                                <Col sm={24} lg={24}>
                                    <Row gutter={[
                                        { xs: 8, sm: 16, md: 24, lg: 32 },
                                        { xs: 8, sm: 16, md: 24, lg: 32 }
                                    ]}>
                                        <Col xs={24} sm={12}>
                                            <RevenueCard
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ margin: 0 }}>Khách hàng</span>
                                                        <RangePicker
                                                            value={dateRange2}
                                                            onChange={(dates) => {
                                                                if (dates) setDateRange2(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                            }}
                                                            format="DD/MM/YYYY"
                                                            allowClear={false}
                                                        />
                                                    </div>
                                                }
                                                value={countUser}
                                                diff={5.54}
                                                height={180}
                                                justify="space-between"
                                            />
                                        </Col>

                                        <Col xs={24} sm={12}>
                                            <RevenueCard
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ margin: 0 }}>Số lượng bán</span>
                                                        <RangePicker
                                                            value={dateRange3}
                                                            onChange={(dates) => {
                                                                if (dates) setDateRange3(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                            }}
                                                            format="DD/MM/YYYY"
                                                            allowClear={false}
                                                        />
                                                    </div>
                                                }
                                                value={countOrder}
                                                diff={-12.3}
                                                height={180}
                                                justify="space-between"
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <RevenueCard
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ margin: 0 }}>Doanh thu</span>
                                                        <RangePicker
                                                            value={dateRange5}
                                                            onChange={(dates) => {
                                                                if (dates) setDateRange5(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                            }}
                                                            format="DD/MM/YYYY"
                                                            allowClear={false}
                                                        />
                                                    </div>
                                                }
                                                value={new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(totalPrice)}
                                                diff={9.52}
                                                height={180}
                                                justify="space-between"
                                            />

                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <RevenueCard
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ margin: 0 }}>Số lượng hủy</span>
                                                        <RangePicker
                                                            value={dateRange4}
                                                            onChange={(dates) => {
                                                                if (dates) setDateRange4(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                            }}
                                                            format="DD/MM/YYYY"
                                                            allowClear={false}
                                                        />
                                                    </div>
                                                }
                                                value={countCancelOrder}
                                                diff={2.34}
                                                height={180}
                                                justify="space-between"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Card
                                        title="Bán hàng"
                                        extra={
                                            <RangePicker
                                                value={dateRange}
                                                onChange={(dates) => {
                                                    if (dates) setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                }}
                                                format="DD/MM/YYYY"
                                                allowClear={false}
                                            />
                                        }
                                        style={cardStyles}
                                    >
                                        <Flex vertical gap="middle">
                                            <Space>
                                                <Title level={3} style={{ margin: 0 }}>
                                                    $ <CountUp end={24485.67} />
                                                </Title>
                                                <Tag color="green-inverse" icon={<ArrowUpOutlined />}>
                                                    8.7%
                                                </Tag>
                                            </Space>
                                            <SalesChart />
                                        </Flex>
                                    </Card>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Card
                                        title="Sản phẩm theo danh mục"
                                        extra={
                                            <RangePicker
                                                value={dateRange6}
                                                onChange={(dates) => {
                                                    if (dates) setDateRange6(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                }}
                                                format="DD/MM/YYYY"
                                                allowClear={false}
                                            />
                                        }
                                        style={cardStyles}
                                    >
                                        <CategoriesChart dateRange6={dateRange6} />
                                    </Card>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <Card title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Top sản phẩm bán chạy</span>
                                            <RangePicker
                                                value={dateRange}
                                                onChange={(dates) => {
                                                    if (dates) setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                }}
                                                format="DD/MM/YYYY"
                                                allowClear={false}
                                            />
                                        </div>
                                    } style={cardStyles}>
                                        {topProductsError ? (
                                            <Alert
                                                message="Error"
                                                description={topProductsError.toString()}
                                                type="error"
                                                showIcon
                                            />
                                        ) : (
                                            <Table
                                                columns={PRODUCTS_COLUMNS}
                                                dataSource={topProducts}
                                                loading={topProductsLoading}
                                                rowKey="id"
                                                className="overflow-scroll"
                                            />
                                        )}
                                    </Card>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Card title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Top sản phẩm bán chậm</span>
                                            <RangePicker
                                                value={dateRange1}
                                                onChange={(dates) => {
                                                    if (dates) setDateRange1(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                }}
                                                format="DD/MM/YYYY"
                                                allowClear={false}
                                            />
                                        </div>
                                    } style={cardStyles}>
                                        {slowProductsError ? (
                                            <Alert
                                                message="Error"
                                                description={slowProductsError.toString()}
                                                type="error"
                                                showIcon
                                            />
                                        ) : (
                                            <Table
                                                columns={PRODUCTS_COLUMNS}
                                                dataSource={slowProducts}
                                                loading={slowProductsLoading}
                                                rowKey="id"
                                                className="overflow-scroll"
                                            />
                                        )}
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ margin: 0 }}>Top nhân viên</span>
                                            <RangePicker
                                                value={dateRange7}
                                                onChange={(dates) => {
                                                    if (dates) setDateRange7(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                                                }}
                                                format="DD/MM/YYYY"
                                                allowClear={false}
                                            />
                                        </div>
                                    }>
                                        {topSellersError ? (
                                            <Alert
                                                message="Error"
                                                description={topSellersError.toString()}
                                                type="error"
                                                showIcon
                                            />
                                        ) : (
                                            <Table
                                                columns={SELLER_COLUMNS}
                                                dataSource={topSellers}
                                                loading={topSellersLoading}
                                                className="overflow-scroll"
                                            />
                                        )}
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title="Đơn hàng gần đây">
                                        {recentOrdersError ? (
                                            <Alert
                                                message="Error"
                                                description={recentOrdersError.toString()}
                                                type="error"
                                                showIcon
                                            />
                                        ) : (
                                            <Table
                                                columns={ORDERS_COLUMNS}
                                                dataSource={recentOrders}
                                                loading={recentOrdersLoading}
                                                className="overflow-scroll"
                                            />
                                        )}
                                    </Card>
                                </Col>
                            </>)}

                    </Row>
                </div>
            </ConfigProvider >

            <ViewTopProductDetail
                onClose={setOpenDrawer}
                open={openDrawer}
                productId={productID}
                setProductId={setProductId}
            />
        </>
    );
};
export default DashboardPage;