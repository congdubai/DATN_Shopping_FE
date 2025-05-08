import { callFetchOrdersById } from "@/config/api";
import { IOrder, IOrderDetail } from "@/types/backend";
import { Badge, Descriptions, Drawer, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IOrder | null;
    setDataInit: (v: any) => void;
}

const ViewOrderDetail = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;
    const [orderDetails, setOrderDetails] = useState<IOrderDetail[]>([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!dataInit?.id) return;

            try {
                const response = await callFetchOrdersById(dataInit.id);
                setOrderDetails(response.data || []);
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
            {orderDetails.length === 0 ? (
                <div>Không có dữ liệu đơn hàng.</div>
            ) : (
                orderDetails.map((detail, index) => (
                    <Descriptions
                        key={detail.id || index}
                        bordered
                        column={1}
                        layout="horizontal"
                        style={{ marginBottom: 24 }}
                    >
                        <Descriptions.Item label="Mã đơn hàng">
                            <Badge status="processing" text={detail.order?.id} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã sản phẩm">
                            {detail.productDetail?.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên sản phẩm">
                            {detail.productDetail?.product?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng">{detail.quantity}</Descriptions.Item>
                        <Descriptions.Item label="Màu sắc">
                            <Badge status="processing" text={detail.color} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Kích cỡ">
                            <Badge status="processing" text={detail.size} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá">
                            {detail.price.toLocaleString()} VND
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {detail.order?.orderDate
                                ? dayjs(detail.order.orderDate).format("DD-MM-YYYY HH:mm:ss")
                                : "Không có ngày tạo"}
                        </Descriptions.Item>
                    </Descriptions>
                ))
            )}
        </Drawer>
    );
};

export default ViewOrderDetail;
