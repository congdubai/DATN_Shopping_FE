import { IRole } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IRole | null;
    setDataInit: (v: any) => void;
}
const ViewDetailRole = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;
    return (
        <>
            <Drawer
                title="Thông Tin vai trò"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={1} layout="vertical">
                    <Descriptions.Item label="Vai trò:">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái:">{dataInit?.active === true ? "ACTIVE" : "INACTIVE"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo:">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : "Chưa có thông tin"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa:">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : "Chưa có thông tin"}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả:">{dataInit?.description}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailRole;