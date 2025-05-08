import { ActionType, ModalForm, ProColumns, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Popconfirm, Row, Select, Space, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateSize, callUpdateOrders, callUpdateSize } from "@/config/api";
import { useEffect, useRef } from 'react';
import { useAppDispatch } from "@/redux/hooks";
import { IOrder, ISize } from "@/types/backend";
import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit?: IOrder | null;
    setDataInit: (v: any) => void;
}

const ModalOrder = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const tableRef = useRef<ActionType>();


    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                ...dataInit,
            })
        }
    }, [dataInit]);


    const handleReset = async () => {
        form.resetFields();
        setOpenModal(false);
        setDataInit(null);
    }
    const columns: ProColumns<IOrder>[] = [
        {

            title: 'Id',
            dataIndex: 'id',
        },
        {

            title: 'Họ tên',
            dataIndex: 'receiverName',
        },
        {

            title: 'Điện thoại',
            dataIndex: 'receiverPhone',
        },
        {
            title: 'Tổng giá',
            dataIndex: 'totalPrice',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            render: (text, record, index, action) => {
                return (
                    <>{record.orderDate ? dayjs(record.orderDate).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
        }, {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, record) => {
                const handleChange = async (value: string) => {
                    const updatedOrder = {
                        ...record,
                        status: value
                    };
                    const res = await callUpdateOrders(record.id!, updatedOrder);
                    if (res.data) {
                        message.success("Cập nhật trạng thái thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        message.error("Cập nhật thất bại");
                    }
                };

                return (
                    <Select
                        defaultValue={record.status}
                        onChange={handleChange}
                        style={{ width: 160 }}
                    >
                        <Select.Option value="Đã đặt hàng">Đã đặt hàng</Select.Option>
                        <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                        <Select.Option value="Đã hoàn thành">Đã hoàn thành</Select.Option>
                    </Select>
                );
            },
        }

    ];

    return (
        <>
            <ModalForm
                title={<>{"Cập nhật đơn hàng"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 800,
                    keyboard: false,
                    maskClosable: false,
                    okText: false,

                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                submitter={false}
                initialValues={dataInit?.id ? {
                    ...dataInit,
                } : {}}
            >
                <div style={{ marginTop: 24, marginBottom: 24 }}>
                    <DataTable<IOrder>
                        actionRef={tableRef}
                        rowKey="id"
                        columns={columns}
                        dataSource={dataInit ? [dataInit] : undefined}
                        scroll={{ x: true }}
                        rowSelection={false}
                        headerTitle={false}
                        pagination={false}
                        search={false}
                        options={false}
                        toolBarRender={false}
                    />
                </div>
            </ModalForm>
        </>
    )
}

export default ModalOrder;
