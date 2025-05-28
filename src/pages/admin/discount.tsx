import ModalColor from "@/components/admin/color/modal.color";
import ViewDetailColor from "@/components/admin/color/view.color";
import ModalDiscount from "@/components/admin/discount/modal.discount";
import ViewDetailDiscount from "@/components/admin/discount/view.discount";
import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { callDeleteColor, callDeleteDiscount } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchColor } from "@/redux/slice/colorSlide";
import { fetchDiscount } from "@/redux/slice/discountSlide";
import { IColor, IDiscount } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRef, useState } from "react";
import { sfLike } from "spring-filter-query-builder";

const DiscountPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IDiscount | null>(null);
    const tableRef = useRef<ActionType>();
    const isFetching = useAppSelector(state => state.discount.isFetching);
    const meta = useAppSelector(state => state.discount.meta);
    const discounts = useAppSelector(state => state.discount.result);

    const dispatch = useAppDispatch();

    const reloadTable = () => {
        tableRef?.current?.reload();
    }
    const handleDeleteDiscount = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteDiscount(id);
            if (+res.statusCode === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Xóa mã giảm giá thành công!',
                    placement: 'topRight',
                });
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }
    const columns: ProColumns<IDiscount>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 100,
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
            title: 'Mã giảm',
            dataIndex: 'code',
            width: 150,
            sorter: true,
        },
        {
            title: '%  giảm',
            dataIndex: 'discountPercent',
            sorter: true,
        },
        {
            title: 'Giảm tối đa',
            dataIndex: 'maxDiscount',
            sorter: true,
            hideInSearch: true,
            render: (text, record) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(record.maxDiscount!)}
                    </>
                );
            }

        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 150,
            sorter: true,
            hideInSearch: true,

        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 150,
            sorter: true,
            render: (text, record) => (
                <>{record.startDate ? dayjs(record.startDate, 'DD/MM/YYYY HH:mm').format('DD-MM-YYYY HH:mm') : ''}</>
            ),
            hideInSearch: true,
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            width: 150,
            sorter: true,
            render: (text, record) => (
                <>  {record.endDate ? dayjs(record.endDate, 'DD/MM/YYYY HH:mm').format('DD-MM-YYYY HH:mm') : ''}</>
            ),
            hideInSearch: true,
        },
        {

            title: 'Chức năng',
            hideInSearch: true,
            width: 120,
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
                            title={"Xác nhận xóa mã giảm giá"}
                            description={"Bạn có chắc chắn muốn xóa mã giảm giá này ?"}
                            onConfirm={() => handleDeleteDiscount(entity.id)}
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
                </Space>
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

        if (clone.code) q.filter = `${sfLike("code", clone.code)}`;
        if (clone.discountPercent) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("discountPercent", clone.discountPercent)}` :
                `${sfLike("discountPercent", clone.discountPercent)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.code) {
            sortBy = sort.code === 'ascend' ? "sort=code,asc" : "sort=code,desc";
        }
        if (sort && sort.discountPercent) {
            sortBy = sort.discountPercent === 'ascend' ? "sort=discountPercent,asc" : "sort=discountPercent,desc";
        }
        if (sort && sort.maxDiscount) {
            sortBy = sort.maxDiscount === 'ascend' ? "sort=maxDiscount,asc" : "sort=maxDiscount,desc";
        }
        if (sort && sort.quantity) {
            sortBy = sort.quantity === 'ascend' ? "sort=quantity,asc" : "sort=quantity,desc";
        }
        if (sort && sort.startDate) {
            sortBy = sort.startDate === 'ascend' ? "sort=startDate,asc" : "sort=startDate,desc";
        }
        if (sort && sort.endDate) {
            sortBy = sort.endDate === 'ascend' ? "sort=endDate,asc" : "sort=endDate,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=startDate,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }
    return (
        <div>
            <Access requiredRole="admin" hideChildren>
                <DataTable<IDiscount>
                    actionRef={tableRef}
                    headerTitle="Danh sách mã giảm giá"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={discounts}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchDiscount({ query }))
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
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
            <ModalDiscount
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit} />
            <ViewDetailDiscount
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )

}
export default DiscountPage;