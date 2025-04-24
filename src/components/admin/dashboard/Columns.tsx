import { createElement } from 'react';
import { blue, green, red, yellow } from '@ant-design/colors';
import { Flex, Image, Progress, Tag, TagProps, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, StarFilled, SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { numberWithCommas } from '@/utils';
import { UserAvatar } from '@/components/admin/dashboard/UserAvatar/UserAvatar';
const { Text, Title } = Typography;

export const PRODUCTS_COLUMNS = [
    {
        title: 'Name',
        dataIndex: 'product_name',
        key: 'product_name',
        render: (_: any, { product_name, brand }: any) => (
            <Flex gap="small" align="center">
                <Image src={brand} width={16} height={16} />
                <Text style={{ width: 160 }}>{product_name}</Text>
            </Flex>
        ),
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (_: any) => <span className="text-capitalize">{_}</span>,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (_: any) => <span>$ {_}</span>,
    },
    {
        title: 'Avg rating',
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

export const CATEGORIES_COLUMNS = [
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (_: any) => <span>$ {_}</span>,
    },
    {
        title: 'Avg rating',
        dataIndex: 'rating',
        key: 'rating',
        render: (_: any) => (
            <Flex align="center" gap="small">
                {_}
                <StarFilled style={{ fontSize: 12 }} />{' '}
            </Flex>
        ),
    },
];

export const SELLER_COLUMNS = [
    {
        title: 'Name',
        dataIndex: 'first_name',
        key: 'first_name',
        render: (_: any, { first_name, last_name }: any) => (
            <UserAvatar fullName={`${first_name} ${last_name}`} />
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (_: any) => <Link to={`mailto:${_}`}>{_}</Link>,
    },
    {
        title: 'Region',
        dataIndex: 'sales_region',
        key: 'sales_region',
    },
    {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
    },
    {
        title: 'Volume',
        dataIndex: 'sales_volume',
        key: 'sales_volume',
        render: (_: any) => <span>{numberWithCommas(Number(_))}</span>,
    },
    {
        title: 'Amount',
        dataIndex: 'total_sales',
        key: 'total_sales',
        render: (_: any) => <span>${numberWithCommas(Number(_))}</span>,
    },
    {
        title: 'Satisfaction rate',
        dataIndex: 'customer_satisfaction',
        key: 'customer_satisfaction',
        render: (_: any) => {
            let color;

            if (_ < 20) {
                color = red[5];
            } else if (_ > 21 && _ < 50) {
                color = yellow[6];
            } else if (_ > 51 && _ < 70) {
                color = blue[5];
            } else {
                color = green[6];
            }

            return <Progress percent={_} strokeColor={color} />;
        },
    },
];

export const ORDERS_COLUMNS = [
    {
        title: 'Tracking No.',
        dataIndex: 'tracking_number',
        key: 'tracking_number',
    },
    {
        title: 'Customer',
        dataIndex: 'customer_name',
        key: 'customer_name',
        render: (_: any) => <UserAvatar fullName={_} />,
    },
    {
        title: 'Date',
        dataIndex: 'order_date',
        key: 'order_date',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (_: any) => <span>$ {_}</span>,
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_: any) => {
            let color: TagProps['color'], icon: any;

            if (_ === 'shipped') {
                color = 'magenta-inverse';
                icon = ClockCircleOutlined;
            } else if (_ === 'processing') {
                color = 'blue-inverse';
                icon = SyncOutlined;
            } else if (_ === 'delivered') {
                color = 'green-inverse';
                icon = CheckCircleOutlined;
            } else {
                color = 'volcano-inverse';
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
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
    },
    {
        title: 'Address',
        dataIndex: 'shipping_address',
        key: 'shipping_address',
    },
];