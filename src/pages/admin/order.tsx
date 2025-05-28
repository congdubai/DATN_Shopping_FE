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
import queryString from "query-string";
import { useRef, useState } from "react";
import { sfLike } from "spring-filter-query-builder";

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
                message.success('Xóa đơn hàng thành công');
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
        },
        {
            title: 'Tổng giá',
            dataIndex: 'totalPrice',
            sorter: true,
            hideInSearch: true,
            render: (text, record) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(record.totalPrice!)}
                    </>
                );
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
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
                            description={"Bạn có chắc chắn muốn xóa đơn hàng này ?"}
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

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        if (clone.receiverName) q.filter = `${sfLike("receiverName", clone.receiverName)}`;
        if (clone.receiverPhone) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("receiverPhone", clone.receiverPhone)}` :
                `${sfLike("receiverPhone", clone.receiverPhone)}`;
        }
        if (clone.status) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("status", clone.status)}` :
                `${sfLike("status", clone.status)}`;
        }
        if (clone.paymentMethod) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("paymentMethod", clone.paymentMethod)}` :
                `${sfLike("paymentMethod", clone.paymentMethod)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.receiverName) {
            sortBy = sort.receiverName === 'ascend' ? "sort=receiverName,asc" : "sort=receiverName,desc";
        }
        if (sort && sort.orderDate) {
            sortBy = sort.orderDate === 'ascend' ? "sort=orderDate,asc" : "sort=orderDate,desc";
        }
        if (sort && sort.totalPrice) {
            sortBy = sort.totalPrice === 'ascend' ? "sort=totalPrice,asc" : "sort=totalPrice,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=orderDate,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

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
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchOrder({ query }))
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