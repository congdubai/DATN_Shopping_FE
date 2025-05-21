import { ModalForm, ProFormDateTimePicker, ProFormDigit, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateColor, callCreateDiscount, callUpdateColor, callUpdateDiscount } from "@/config/api";
import { useEffect } from 'react';
import { IDiscount } from "@/types/backend";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from "dayjs";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit?: IDiscount | null;
    setDataInit: (v: any) => void;
}

const ModalDiscount = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                ...dataInit,
                startDate: dayjs(dataInit.startDate, 'DD/MM/YYYY HH:mm'),
                endDate: dayjs(dataInit.endDate, 'DD/MM/YYYY HH:mm'),
            })
        }
    }, [dataInit]);

    const submitDiscount = async (valuesForm: any) => {
        const { code, discountPercent, quantity, maxDiscount, description, startDate, endDate } = valuesForm;

        if (dataInit?.id) {
            //update
            const discount = {
                code, discountPercent, quantity, maxDiscount, description, startDate, endDate
            }
            const res = await callUpdateDiscount(discount, dataInit.id);
            if (res.data) {
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật mã giảm giá thành công!',
                    placement: 'topRight',
                });
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
            const discount = {
                code, discountPercent, quantity, maxDiscount, description, startDate, endDate
            }
            const res = await callCreateDiscount(discount);
            if (res.data) {
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm mã giảm giá thành công!',
                    placement: 'topRight',
                });
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
                title={<>{dataInit?.id ? "Cập nhật mã giảm giá" : "Tạo mới mã giảm giá"}</>}
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
                onFinish={submitDiscount}
                initialValues={dataInit?.id ? {
                    ...dataInit,
                } : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Mã giảm giá"
                            name="code"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập mã giảm giá"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Phần trăm giảm"
                            name="discountPercent"
                            placeholder="Nhập phần trăm giảm"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Số lượng"
                            name="quantity"
                            placeholder="Nhập số lượng"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Giá giảm"
                            name="maxDiscount"
                            placeholder="Nhập giá giảm"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDateTimePicker
                            label="Ngày bắt đầu"
                            name="startDate"
                            width={365}
                            placeholder="Chọn ngày bắt đầu"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                            fieldProps={{
                                locale: locale,
                                format: 'DD/MM/YYYY HH:mm',
                            }}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDateTimePicker
                            label="Ngày kết thúc"
                            name="endDate"
                            width={365}
                            placeholder="Chọn ngày kết thúc"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                            fieldProps={{
                                locale: locale,
                                format: 'DD/MM/YYYY HH:mm',
                            }}
                        />
                    </Col>


                    <Col span={24}>
                        <ProFormTextArea
                            label="Miêu tả"
                            name="description"
                            placeholder="Nhập miêu tả mã giảm"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalDiscount;
