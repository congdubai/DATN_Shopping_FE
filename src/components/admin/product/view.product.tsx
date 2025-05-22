import { IProduct } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IProduct | null;
    setDataInit: (v: any) => void;
}
const ViewDetailProduct = (props: IProps) => {
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
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/product/${dataInit?.image}`}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Tên sản phẩm">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Giá nhập">{dataInit?.minPrice}</Descriptions.Item>

                    <Descriptions.Item label="Giá bán">{dataInit?.price}</Descriptions.Item>
                    <Descriptions.Item label="Danh mục">
                        <Badge status="processing" text={<>{dataInit?.category?.name}</>} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo">
                        {dataInit?.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit?.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>

                    <Descriptions.Item label="Mô tả ngắn">{dataInit?.shortDesc}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                        <div dangerouslySetInnerHTML={{ __html: dataInit?.detailDesc || "" }} />
                    </Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailProduct;