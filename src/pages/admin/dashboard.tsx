import { CSSProperties, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Alert, Button, ButtonProps, Col, ConfigProvider, Flex, Image, Popover, Progress, Row, Space, Table, Tag, TagProps, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, QuestionOutlined, StarFilled, SyncOutlined } from '@ant-design/icons';
import useFetchData from '@/redux/useFetchData';
import { useStylesContext } from '@/context';
import { Card } from '@/components/admin/dashboard/Card/Card';
import { CustomerReviewsCard } from '@/components/admin/dashboard/CustomerReviewsCard/CustomerReviewsCard';
import { RevenueCard } from '@/components/admin/dashboard/RevenueCard/RevenueCard';
import "@/styles/dashboard.css"
import { callFetchCountUsersByDay } from '@/config/api';
import SalesChart from '@/components/admin/dashboard/chart/SalesChart';
import CategoriesChart from '@/components/admin/dashboard/chart/CategoriesChart';
import OrdersStatusChart from '@/components/admin/dashboard/chart/OrdersStatusChart';
import CustomerRateChart from '@/components/admin/dashboard/chart/CustomerRateChart';
import { CATEGORIES_COLUMNS, ORDERS_COLUMNS, PRODUCTS_COLUMNS, SELLER_COLUMNS } from '@/components/admin/dashboard/Columns';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await callFetchCountUsersByDay();
                setCountUser(res.data!);
            } catch (error) {
                console.error('Lỗi khi lấy số lượng user:', error);
            }
        };

        fetchData();
    }, []);


    const {
        data: topProducts,
        error: topProductsError,
        loading: topProductsLoading,
    } = useFetchData('../mocks/TopProducts.json');
    const {
        data: topCategories,
        error: topCategoriesError,
        loading: topCategoriesLoading,
    } = useFetchData('../mocks/TopCategories.json');
    const {
        data: topSellers,
        error: topSellersError,
        loading: topSellersLoading,
    } = useFetchData('../mocks/TopSeller.json');
    const {
        data: recentOrders,
        error: recentOrdersError,
        loading: recentOrdersLoading,
    } = useFetchData('../mocks/RecentOrders.json');

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
                        <Col sm={24} lg={16}>
                            <Row gutter={[
                                { xs: 8, sm: 16, md: 24, lg: 32 },
                                { xs: 8, sm: 16, md: 24, lg: 32 }
                            ]}>
                                <Col xs={24} sm={12}>
                                    <RevenueCard
                                        title="Khách hàng"
                                        value={countUser}
                                        diff={5.54}
                                        height={180}
                                        justify="space-between"
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <RevenueCard
                                        title="Customers"
                                        value={5834}
                                        diff={-12.3}
                                        height={180}
                                        justify="space-between"
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <RevenueCard
                                        title="Orders"
                                        value={3270}
                                        diff={9.52}
                                        height={180}
                                        justify="space-between"
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <RevenueCard
                                        title="Sales"
                                        value="$ 1.324K"
                                        diff={2.34}
                                        height={180}
                                        justify="space-between"
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={24} lg={8}>
                            <CustomerReviewsCard />
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card
                                title="Overall sales"
                                extra={
                                    <Popover content="Total sales over period x" title="Total sales">
                                        <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
                                    </Popover>
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
                                title="Categories"
                                extra={
                                    <Popover content="Sales per categories" title="Categories sales">
                                        <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
                                    </Popover>
                                }
                                style={cardStyles}
                            >
                                <CategoriesChart />
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card
                                title="Orders by status"
                                extra={
                                    <Popover content="Orders by status" title="Orders">
                                        <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
                                    </Popover>
                                }
                                style={cardStyles}
                            >
                                <OrdersStatusChart />
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Flex vertical gap="middle">
                                <Card
                                    title="Conversion rate"
                                    extra={
                                        <Popover
                                            content="Customer conversion rate"
                                            title="Conversion rate"
                                        >
                                            <Button
                                                icon={<QuestionOutlined />}
                                                {...POPOVER_BUTTON_PROPS}
                                            />
                                        </Popover>
                                    }
                                >
                                    <Flex vertical gap="middle" justify="center">
                                        <Typography.Title style={{ margin: 0 }}>8.48%</Typography.Title>
                                        <Row>
                                            <Col sm={24} lg={8}>
                                                <Space direction="vertical">
                                                    <Text>Added to cart</Text>
                                                    <Text type="secondary">5 visits</Text>
                                                </Space>
                                            </Col>
                                            <Col sm={24} lg={8}>
                                                <Text className="text-end" strong>
                                                    $ <CountUp end={27483.7} decimals={2} />
                                                </Text>
                                            </Col>
                                            <Col sm={24} lg={8}>
                                                <Tag color="green-inverse" icon={<ArrowUpOutlined />}>
                                                    16.8%
                                                </Tag>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={24} lg={8}>
                                                <Space direction="vertical">
                                                    <Text>Reached to Checkout</Text>
                                                    <Text type="secondary">23 visits</Text>
                                                </Space>
                                            </Col>
                                            <Col sm={24} lg={8}>
                                                <Text className="text-end" strong>
                                                    $ <CountUp end={145483.7} decimals={2} />
                                                </Text>
                                            </Col>
                                            <Col sm={24} lg={8}>
                                                <Tag color="red-inverse" icon={<ArrowDownOutlined />}>
                                                    -46.8%
                                                </Tag>
                                            </Col>
                                        </Row>
                                    </Flex>
                                </Card>
                                <Card title="Customer rate">
                                    <div style={{ height: 80, textAlign: 'center' }}>
                                        <CustomerRateChart />
                                    </div>
                                </Card>
                            </Flex>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="Popular products" style={cardStyles}>
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
                                        className="overflow-scroll"
                                    />
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="Popular categories" style={cardStyles}>
                                {topCategoriesError ? (
                                    <Alert
                                        message="Error"
                                        description={topCategoriesError.toString()}
                                        type="error"
                                        showIcon
                                    />
                                ) : (
                                    <Table
                                        columns={CATEGORIES_COLUMNS}
                                        dataSource={topCategories}
                                        loading={topCategoriesLoading}
                                        className="overflow-scroll"
                                    />
                                )}
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="Top sellers">
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
                            <Card title="Recent orders">
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
                    </Row>
                </div>
            </ConfigProvider >
        </>
    );
};
export default DashboardPage;