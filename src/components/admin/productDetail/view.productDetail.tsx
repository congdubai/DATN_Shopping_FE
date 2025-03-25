import { IProduct, IProductDetail } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IProductDetail | null;
    setDataInit: (v: any) => void;
}
const ViewDetailProductDetail = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;
    return (
        <>
            <Drawer
                title="Thông Tin sản phẩm"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={1} layout="horizontal">
                    <Descriptions.Item label="Ảnh sản phẩm">
                        <img
                            alt="Product Image"
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/product/${dataInit?.imageDetail}`}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataInit?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Sản phẩm">
                        <Badge status="processing" text={<>{dataInit?.product?.name}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Màu sắc">
                        <Badge status="processing" text={<>{dataInit?.color?.name}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="size">
                        <Badge status="processing" text={<>{dataInit?.size?.name}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {dataInit?.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit?.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tạo bởi">{dataInit?.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Cập nhật bởi">{dataInit?.updatedBy}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailProductDetail;