import { createElement, useState } from 'react';
import { blue, green, red, yellow } from '@ant-design/colors';
import { Col, Flex, Image, Progress, Row, Tag, TagProps, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, StarFilled, SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { numberWithCommas } from '@/utils';
import { UserAvatar } from '@/components/admin/dashboard/UserAvatar/UserAvatar';
import { ITopProduct, ITopSeller } from '@/types/backend';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch } from '@/redux/hooks';
const { Text, Title } = Typography;


export const SNOW_PRODUCTS_COLUMNS = [
    {
        title: 'Sản phẩm',
        dataIndex: 'product_name',
        key: 'product_name',
        render: (_: any, { product_name, brand }: any) => (
            <Flex gap="small" align="center" >
                <Image src={brand} width={16} height={16} />
                <Text style={{ width: 160 }}>{product_name}</Text>
            </Flex>
        ),
    },
    {
        title: 'Số lượng',
        dataIndex: 'category',
        key: 'category',
        render: (_: any) => <span className="text-capitalize">{_}</span>,
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
        render: (_: any) => <span>$ {_}</span>,
    },
    {
        title: 'Đánh giá',
        dataIndex: 'average_rating',
        key: 'average_rating',
        render: (_: any) => (
            <Flex align="center" gap="small">
                {_}
                <StarFilled style={{ fontSize: 12 }} />{' '}
            </Flex>
        ),
    },
];

export const SELLER_COLUMNS: ColumnsType<ITopSeller> = [
    {
        title: 'Tên nhân viên',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (_: any, record: ITopSeller) => (
            <UserAvatar fullName={record.name} />
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 100,
        align: 'center',
        render: (email: string) => <Link to={`mailto:${email}`}>{email}</Link>,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
    },
    {
        title: 'Số lượng bán',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        align: 'center',
        render: (value: number) => <span>{numberWithCommas(value)}</span>,
    },
    {
        title: 'Doanh thu',
        dataIndex: 'totalSpent',
        key: 'totalSpent',
        align: 'center',
        render: (value: number) => <span>{numberWithCommas(value)}₫</span>,
    },
];


export const ORDERS_COLUMNS = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Khách hàng',
        dataIndex: 'receiverName',
        key: 'receiverName',
        render: (_: any) => <UserAvatar fullName={_} />,
    },
    {
        title: 'Ngày đặt',
        dataIndex: 'orderDate',
        key: 'orderDate',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (_: any) => <span>$ {_}</span>,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (_: any) => {
            let color: TagProps['color'], icon: any;

            if (_ === 'shipped') {
                color = 'magenta-inverse';
                icon = ClockCircleOutlined;
            } else if (_ === 'Đang xử lý') {
                color = 'blue-inverse';
                icon = SyncOutlined;
            } else if (_ === 'Đã hoàn thành') {
                color = 'green-inverse';
                icon = CheckCircleOutlined;
            } else {
                color = 'Đã hủy';
                icon = ExclamationCircleOutlined;
            }

            return (
                <Tag
                    className="text-capitalize"
                    color={color}
                    icon={createElement(icon)}
                >
                    {_}
                </Tag>
            );
        },
    },
    {
        title: 'Điện thoại',
        dataIndex: 'receiverPhone',
        key: 'receiverPhone',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'receiverAddress',
        key: 'receiverAddress',
        align: 'center' as const,
    },
];
