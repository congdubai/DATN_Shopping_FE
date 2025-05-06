import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callCreateRate } from '@/config/api';
import { Client, Stomp } from '@stomp/stompjs';
import { Col, Divider, Form, message, notification, Rate, Row } from 'antd';
import { useState, useEffect } from 'react';
import { ModalForm, ProCard } from '@ant-design/pro-components';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import { IHistory } from '@/types/backend';
import SockJS from 'sockjs-client';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IHistory | null;
    setDataInit: (v: any) => void;
}

const ModalRate = (props: IProps) => {
    const { openModal, setOpenModal, dataInit, setDataInit } = props;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [value, setValue] = useState<string>("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const desc = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];
    const [valueRate, setValueRate] = useState(1);
    const userId = useAppSelector(state => state.account.user.id);
    const [client, setClient] = useState<Client | null>(null);

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
        setValue("");
        setValueRate(1);
    };

    const handleRateChange = (value: number) => {
        setValueRate(value);
    };

    const submitReview = async (valuesForm: any) => {
        const review = {
            product: { id: dataInit?.productId! },
            rating: valueRate,
            comment: value,
            user: { id: userId! },
            order: { id: dataInit?.orderId! }
        };

        try {
            const response = await callCreateRate(review);
            if (response.statusCode === 201) {
                notification.success({
                    message: 'Đánh giá thành công',
                    description: 'Cảm ơn bạn đã mua hàng!',
                    placement: 'topRight',
                });
                handleReset();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: response.error
                });
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    return (
        <ModalForm
            title={"Đánh giá sản phẩm"}
            open={openModal}
            modalProps={{
                onCancel: () => { handleReset() },
                afterClose: () => handleReset(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                keyboard: false,
                maskClosable: false,
                okText: <>{"Đánh giá"}</>,
                cancelText: "Hủy"
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitReview}
        >
            <Row gutter={16}>
                <Row align="middle" justify="start" style={{ marginTop: 10 }}>
                    <Col md={3}>
                        <img
                            src={`${backendUrl}/storage/product/${dataInit?.image}`}
                            alt="Sản phẩm"
                            style={{ width: "90%", borderRadius: "2px", height: "35px", marginRight: "10px" }}
                        />
                    </Col>
                    <Col md={21}>
                        <h3 style={{ margin: 0 }}>
                            {dataInit?.name}
                        </h3>
                    </Col>
                </Row>
                <Divider style={{ marginTop: "10px" }} />

                <Row align="middle" justify="start">
                    <Col>
                        <span style={{ margin: 0, fontWeight: 500 }}>Chất lượng sản phẩm</span>
                    </Col>
                    <Col style={{ marginLeft: 15 }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Rate
                                tooltips={desc}
                                onChange={handleRateChange}
                                value={valueRate}
                            />
                            {valueRate ? <span>{desc[valueRate - 1]}</span> : null}
                        </div>
                    </Col>
                </Row>
                <ProCard
                    title="Nhận xét"
                    headStyle={{ color: "#d81921" }}
                    style={{ marginBottom: 20, marginTop: 15 }}
                    headerBordered
                    size="small"
                    bordered
                >
                    <Col span={24}>
                        <ReactQuill
                            theme="snow"
                            value={value}
                            onChange={setValue}
                            className="custom-editor"
                            modules={{
                                toolbar: true,
                            }}
                        />
                        <style>
                            {`
                            .custom-editor .ql-editor {
                                min-height: 80px;
                            }
                        `}

                        </style>
                    </Col>
                </ProCard>
            </Row>
        </ModalForm>
    );
};

export default ModalRate;
