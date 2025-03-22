import { ICategory, IRole } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: ICategory | null;
    setDataInit: (v: any) => void;
}
const ViewDetailCategory = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;
    return (
        <>
            <Drawer
                title="Thông Tin danh mục"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={1} layout="horizontal">
                    <Descriptions.Item label="Ảnh Danh mục">
                        <img
                            alt="Product Image"
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/product/${dataInit?.image}`}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò:">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo:">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : "Chưa có thông tin"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa:">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : "Chưa có thông tin"}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả:">{dataInit?.description}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailCategory;