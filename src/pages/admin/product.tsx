import ModalProduct from "@/components/admin/product/modal.product";
import ViewDetailProduct from "@/components/admin/product/view.product";
import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { callDeleteProduct } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProduct } from "@/redux/slice/productSlide";
import { IProduct } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm, Space } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRef, useState } from "react";
import { sfLike } from "spring-filter-query-builder";

const ProductPage = () => {
    const products = useAppSelector(state => state.product.result);
    const meta = useAppSelector(state => state.product.meta);
    const isFetching = useAppSelector(state => state.product.isFetching);
    const dispatch = useAppDispatch();
    const tableRef = useRef<ActionType>();
    const [dataInit, setDataInit] = useState<IProduct | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const handleDeleteProduct = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteProduct(id);
            if (+res.statusCode === 200) {
                message.success('Xóa sản phẩm thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const columns: ProColumns<IProduct>[] = [
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
            title: 'Ảnh',
            dataIndex: 'image',
            align: 'center',
            width: 150,
            hideInSearch: true,
            render: (_, entity: IProduct) => {
                return entity.image ? (
                    <img
                        alt="Product Image"
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/product/${entity.image}`}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}

                    />
                ) : (
                    <span>No Image</span>
                );

            }
        },
        {

            title: 'Tên',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render: (text, record) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(record.price!)}
                    </>
                );
            }
        },
        {
            title: 'Danh mục',
            dataIndex: ["category", "name"],
            width: 200,
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

            title: 'Actions',
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
                            title={"Xác nhận xóa Sản phẩm"}
                            onConfirm={() => handleDeleteProduct(entity.id)}
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
    const buildQuery = (params: any, sort: any, filter: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        const clone = { ...params };
        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;

        if (clone.category?.name) {
            q.filter = q.filter ?
                q.filter + " and " + `${sfLike("category.name", clone.category.name)}` :
                `${sfLike("category.name", clone.category.name)}`;
        }

        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.price) {
            sortBy = sort.price === 'ascend' ? "sort=price,asc" : "sort=price,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=createdAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }
    return (
        <div>
            <Access requiredRole="admin" hideChildren>
                <DataTable<IProduct>
                    actionRef={tableRef}
                    headerTitle="Danh sách sản phẩm"
                    rowKey="id"
                    columns={columns}
                    dataSource={products}
                    loading={isFetching}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchProduct({ query }))
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

            <ModalProduct
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
            <ViewDetailProduct
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit} />
        </div >
    )
}
export default ProductPage;