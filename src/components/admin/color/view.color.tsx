import { IColor } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IColor | null;
    setDataInit: (v: any) => void;
}
const ViewDetailcolor = (props: IProps) => {
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
                    <Descriptions.Item label="Màu sắc:">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Mã màu:">
                        {dataInit?.hexCode ? (
                            <div
                                style={{
                                    width: 40,
                                    height: 20,
                                    backgroundColor: dataInit?.hexCode,
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}
                            />
                        ) : (
                            ""
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo:">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : "Chưa có thông tin"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa:">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : "Chưa có thông tin"}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả:">{dataInit?.description}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailcolor;