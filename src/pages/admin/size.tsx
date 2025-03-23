import ModalSize from "@/components/admin/size/modal.size";
import ViewDetailSize from "@/components/admin/size/view.size";
import DataTable from "@/components/client/data-table";
import { callDeleteSize } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSize } from "@/redux/slice/sizeSlide";
import { ISize } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRef, useState } from "react";
import { sfLike } from "spring-filter-query-builder";

const SizePage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ISize | null>(null);
    const tableRef = useRef<ActionType>();
    const isFetching = useAppSelector(state => state.size.isFetching);
    const meta = useAppSelector(state => state.size.meta);
    const sizes = useAppSelector(state => state.size.result);

    const dispatch = useAppDispatch();

    const reloadTable = () => {
        tableRef?.current?.reload();
    }
    const handleDeleteUser = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteSize(id);
            if (+res.statusCode === 200) {
                message.success('Xóa vai trò thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }
    const columns: ProColumns<ISize>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 100,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record.id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            width: 300,
            sorter: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            sorter: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Chức năng',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
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
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa size"}
                        description={"Bạn có chắc chắn muốn xóa size này ?"}
                        onConfirm={() => handleDeleteUser(entity.id)}
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

        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }
    return (
        <div>

            <DataTable<ISize>
                actionRef={tableRef}
                headerTitle="Danh sách Size"
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={sizes}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchSize({ query }))
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
            <ViewDetailSize
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
            <ModalSize
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit} />
        </div>
    )

}
export default SizePage;