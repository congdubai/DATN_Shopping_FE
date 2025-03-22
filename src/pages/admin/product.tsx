import ModalProduct from "@/components/admin/product/modal.product";
import ViewDetailProduct from "@/components/admin/product/view.product";
import DataTable from "@/components/client/data-table";
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

    const columns: ProColumns<IProduct>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
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
            title: 'Image',
            dataIndex: 'image',
            align: 'center',
            width: 150,
            render: (_, entity: IProduct) => {
                console.log("Original Image Name:", entity.image);
                console.log("Decoded Image Name:", decodeURIComponent(entity.image));
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

            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: ["category", "name"],
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'CreatedAt',
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

            title: 'Actions',
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
        if (clone.email) {
            q.filter = clone.name ?
                q.filter + " and " + `${sfLike("email", clone.email)}`
                : `${sfLike("email", clone.email)}`;
        }

        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.email) {
            sortBy = sort.email === 'ascend' ? "sort=email,asc" : "sort=email,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }
    return (
        <div>

            <DataTable<IProduct>
                actionRef={tableRef}
                headerTitle="Danh sách Users"
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