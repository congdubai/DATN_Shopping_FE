import { IColor, IDiscount } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IDiscount | null;
    setDataInit: (v: any) => void;
}
const ViewDetailDiscount = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;
    return (
        <>
            <Drawer
                title="Thông Tin mã giảm giá"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={1} layout="horizontal">
                    <Descriptions.Item label="ID:">{dataInit?.id}</Descriptions.Item>
                    <Descriptions.Item label="Mã giảm giá:">{dataInit?.code}</Descriptions.Item>
                    <Descriptions.Item label="Phần trăm giả:">{dataInit?.discountPercent}</Descriptions.Item>
                    <Descriptions.Item label="Giá giảm:">{dataInit?.maxDiscount}</Descriptions.Item>
                    <Descriptions.Item label="Kích thước:">{dataInit?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu:">
                        {dataInit?.startDate
                            ? dayjs(dataInit.startDate, 'DD/MM/YYYY HH:mm').isValid()
                                ? dayjs(dataInit.startDate, 'DD/MM/YYYY HH:mm').format('DD-MM-YYYY HH:mm')
                                : "Ngày không hợp lệ"
                            : "Chưa có thông tin"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày kết thúc:">
                        {dataInit?.endDate
                            ? dayjs(dataInit.endDate, 'DD/MM/YYYY HH:mm').isValid()
                                ? dayjs(dataInit.endDate, 'DD/MM/YYYY HH:mm').format('DD-MM-YYYY HH:mm')
                                : "Ngày không hợp lệ"
                            : "Chưa có thông tin"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả:">{dataInit?.description}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailDiscount;