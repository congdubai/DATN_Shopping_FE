import { callFetchOrderById, callFetchOrdersById, callUpdateOrders } from "@/config/api";
import { IHistory, IOrder, IOrderDetail } from "@/types/backend";
import { Badge, Button, Descriptions, Drawer, message, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface IProps {
    onClose: (open: boolean) => void;
    open: boolean;
    dataInit: IHistory | null;
    setDataInit: (val: IHistory | null) => void;
    reloadHistory: () => void;
}


const ViewHistoryDetail = (props: IProps) => {
    const { onClose, open, dataInit, reloadHistory } = props;
    const [order, setOrder] = useState<IOrder>();

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined) return "";
        return amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };
    const handleCancelOrder = async () => {
        if (!order?.id) return;

        const updatedOrder: IOrder = {
            ...order,
            status: "Đã hủy",
        };

        try {
            const res = await callUpdateOrders(order.id, updatedOrder);
            if (res.data) {
                notification.success({
                    message: "Thành công",
                    description: "Hủy đơn hàng thành công!",
                    placement: "topRight",
                });
                onClose(false); // đóng Drawer
                reloadHistory();
            } else {
                notification.error({
                    message: "Thất bại",
                    description: "Cập nhật thất bại!",
                    placement: "topRight",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật!",
                placement: "topRight",
            });
        }
    };


    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!dataInit?.id) return;

            try {
                const response = await callFetchOrderById(dataInit.orderId!);
                setOrder(response.data!);
            } catch (error) {
                message.error("Lấy thông tin đơn hàng thất bại");
            }
        };

        fetchOrderDetails();
    }, [dataInit?.id, open]);

    return (
        <Drawer
            title="Thông Tin Chi Tiết Đơn Hàng"
            placement="right"
            onClose={() => onClose(false)}
            open={open}
            width={"40vw"}
            maskClosable={false}
        >
            {order === null ? (
                <div>Không có dữ liệu đơn hàng.</div>
            ) : (
                <>
                    <Descriptions
                        key={order?.id}
                        bordered
                        column={1}
                        layout="horizontal"
                        style={{ marginBottom: 24 }}
                    >
                        <Descriptions.Item label="Mã đơn hàng">
                            {order?.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ tên">
                            <Badge status="processing" text={order?.receiverName} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Điện thoại">
                            <Badge status="processing" text={order?.receiverPhone} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Thanh toán">
                            {order?.paymentMethod}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng giá">
                            <Badge status="processing" text={formatCurrency(order?.totalPrice)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Badge status="processing" text={order?.status} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {order?.orderDate &&
                                dayjs(order.orderDate, "YYYY-MM-DD HH:mm:ss A").isValid()
                                ? dayjs(order.orderDate, "YYYY-MM-DD HH:mm:ss A").format("DD-MM-YYYY HH:mm:ss")
                                : "Không có ngày tạo"}
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{ textAlign: "right" }}>
                        <Button
                            danger
                            type="primary"
                            style={{ fontWeight: 600 }}
                            disabled={order?.status !== "Đang xử lý"}
                            onClick={handleCancelOrder}
                        >
                            Hủy đơn hàng
                        </Button>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default ViewHistoryDetail;
