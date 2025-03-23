import { ModalForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateColor, callUpdateColor } from "@/config/api";
import { useEffect } from 'react';
import { useAppDispatch } from "@/redux/hooks";
import { IColor } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit?: IColor | null;
    setDataInit: (v: any) => void;
}

const ModalColor = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                ...dataInit,
            })
        }
    }, [dataInit]);

    const submitColor = async (valuesForm: any) => {
        const { description, name } = valuesForm;

        if (dataInit?.id) {
            //update
            const color = {
                name, description
            }
            const res = await callUpdateColor(color, dataInit.id);
            if (res.data) {
                message.success("Cập nhật color thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const color = {
                name, description
            }
            const res = await callCreateColor(color);
            if (res.data) {
                message.success("Thêm mới color thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setOpenModal(false);
        setDataInit(null);
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật Color" : "Tạo mới Color"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 800,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitColor}
                initialValues={dataInit?.id ? {
                    ...dataInit,
                } : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Color"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            label="Miêu tả"
                            name="description"
                            placeholder="Nhập miêu tả color"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalColor;
