import { Alert, Button, Card, Col, ConfigProvider, DatePicker, Flex, Image, Row, Table, Typography } from "antd";
import dayjs from "dayjs";
import { COLOR } from "./dashboard";
import { FileExcelOutlined, StarFilled } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { IOrderProfitDTO, ITopProduct } from "@/types/backend";
import { CSSProperties, useEffect, useState } from "react";
import { callFetchOrderProfit, callFetchTopSellingProducts } from "@/config/api";
import { UserAvatar } from "@/components/admin/dashboard/UserAvatar/UserAvatar";
import axios from "axios";

const { RangePicker } = DatePicker;
const cardStyles: CSSProperties = {
    height: '100%',
};
const ExportPage = () => {
    const { Text, Title } = Typography;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [orderProfit, setOrderProfit] = useState<IOrderProfitDTO[]>([]);
    const [topProductsLoading, setTopProductsLoading] = useState(false);
    const [topProductsError, setTopProductsError] = useState<any>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [productID, setProductId] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs(),
    ]);
    useEffect(() => {
        const fetchOrderProfit = async () => {
            setTopProductsLoading(true);
            try {
                const [start, end] = dateRange;
                const res = await callFetchOrderProfit(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );
                setOrderProfit(res.data!);
            } catch (error: any) {
                setTopProductsError(error);
            } finally {
                setTopProductsLoading(false);
            }
        };

        fetchOrderProfit();
    }, [dateRange]);

    const handleExportExcel = async () => {
        try {
            const [start, end] = dateRange;
            const response = await axios.get(
                `${backendUrl}/api/v1/dashboard/export-excel`,
                {
                    params: {
                        startDate: start.startOf("day").toISOString(),
                        endDate: end.endOf("day").toISOString(),
                    },
                    responseType: "blob",
                }
            );

            // Tạo URL từ file blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "BaoCao.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Giải phóng URL để tránh rò rỉ bộ nhớ
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
            // Có thể show message lỗi ra UI nếu cần
        }
    };

    const PRODUCTS_ORDER_PROFIT: ColumnsType<IOrderProfitDTO> = [
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 100,
            render: (_: any) => <UserAvatar fullName={_} />,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            align: 'center',
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: 'center',
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            align: 'center',
            render: (value: number) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(value),
        },
        {
            title: "Giá nhập",
            dataIndex: "minPrice",
            key: "minPrice",
            align: 'center',
            render: (value: number) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(value),
        },
        {
            title: "Lợi nhuận",
            dataIndex: "profit",
            key: "profit",
            align: 'center',
            render: (value: number) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(value),
        },
        {
            title: "Ngày đặt",
            dataIndex: "orderDate",
            key: "orderDate",
            align: 'center',
            render: (value: string) =>
                dayjs(value).format("DD/MM/YYYY HH:mm"),
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
                        }}>
                        <>
                            <Col xs={24} lg={24}>
                                <Card title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Báo cáo doanh thu</span>
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
                                        <>
                                            <Table
                                                columns={PRODUCTS_ORDER_PROFIT}
                                                dataSource={orderProfit}
                                                loading={topProductsLoading}
                                                rowKey="id"
                                                className="overflow-scroll"
                                            />
                                            <Col
                                                span={24}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}
                                            >
                                                <div style={{ fontSize: 18, fontWeight: 500 }}>
                                                    Tổng lợi nhuận: <span style={{ fontSize: 20, fontWeight: 600 }}>
                                                        {
                                                            new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(orderProfit.reduce((sum, order) => sum + order.profit, 0))
                                                        }
                                                    </span>
                                                </div>
                                                <Button
                                                    style={{
                                                        backgroundColor: '#1D6F42',
                                                        border: 'none',
                                                        borderRadius: 4,
                                                        color: 'white'
                                                    }}
                                                    onClick={handleExportExcel}
                                                >
                                                    Xuất Excel <FileExcelOutlined style={{ color: 'white', marginLeft: 8 }} />
                                                </Button>
                                            </Col>
                                        </>
                                    )}
                                </Card>

                            </Col>
                        </>
                    </Row>
                </div>
            </ConfigProvider >
        </>
    );
}
export default ExportPage;