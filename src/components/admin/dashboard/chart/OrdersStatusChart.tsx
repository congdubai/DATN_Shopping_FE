import { Pie } from '@ant-design/charts';

const OrdersStatusChart = () => {
    const data = [
        {
            type: 'Success',
            value: 27,
        },
        {
            type: 'Pending',
            value: 55,
        },
        {
            type: 'Failed',
            value: 18,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    // @ts-ignore
    return <Pie {...config} />;
};
export default OrdersStatusChart;