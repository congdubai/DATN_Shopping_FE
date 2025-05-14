import ModalOrder from "@/components/admin/order/modal.order";
import ViewOrderDetail from "@/components/admin/order/view.order";
import ModalProduct from "@/components/admin/product/modal.product";
import ViewDetailProduct from "@/components/admin/product/view.product";
import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { callDeleteOrders, callDeleteProduct } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrder } from "@/redux/slice/orderSlide";
import { IOrder, IProduct } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { message, notification, Popconfirm, Space } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";

const OrderPage = () => {
    const orders = useAppSelector(state => state.order.result);
    const meta = useAppSelector(state => state.order.meta);
    const isFetching = useAppSelector(state => state.order.isFetching);
    const dispatch = useAppDispatch();
    const tableRef = useRef<ActionType>();
    const [dataInit, setDataInit] = useState<IOrder | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const handleDeleteOrder = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteOrders(id);
            if (+res.statusCode === 200) {
                message.success('Xóa User thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const columns: ProColumns<IOrder>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
            render: (text, record, index, action) => {
                return (
                    <Access requiredRole="admin" hideChildren>
                        <a href="#" onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}>
                            {record.id}
                        </a>
                    </Access>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Họ tên',
            dataIndex: 'receiverName',
            sorter: true,
        },
        {

            title: 'Điện thoại',
            dataIndex: 'receiverPhone',
            sorter: true,
        },
        {
            title: 'Tổng giá',
            dataIndex: 'totalPrice',
            sorter: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            sorter: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'orderDate',
            width: 200,
            sorter: true,
            render: (_, record) => {
                const d = dayjs(record.orderDate, "YYYY-MM-DD hh:mm:ss A");
                if (!d.isValid()) return "Không hợp lệ";
                return d.format("DD-MM-YYYY HH:mm:ss");
            },
            hideInSearch: true,
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            sorter: true,
        },
        {

            title: 'Chức năng',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access requiredRole="admin" hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access requiredRole="admin" hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa đơn hàng"}
                            onConfirm={() => handleDeleteOrder(entity.id)}
                            description={"Bạn có chắc chắn muốn xóa Sản phẩm này ?"}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>

                </Space >
            ),

        },
    ];

    return (
        <div>
            <Access requiredRole="admin" hideChildren>
                <DataTable<IOrder>
                    actionRef={tableRef}
                    headerTitle="Danh sách đơn hàng"
                    rowKey="id"
                    columns={columns}
                    dataSource={orders}
                    loading={isFetching}
                    request={async (params, sort, filter): Promise<any> => {
                        dispatch(fetchOrder())
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.page,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                />
            </Access>
            <ModalOrder
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
            <ViewOrderDetail
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit} />
        </div >
    )
}
export default OrderPage;