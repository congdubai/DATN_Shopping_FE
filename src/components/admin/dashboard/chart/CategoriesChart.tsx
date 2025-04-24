import {Pie} from '@ant-design/charts';

const CategoriesChart = () => {
    const data = [
        {
            type: 'Appliances',
            value: 27,
        },
        {
            type: 'Electronics',
            value: 25,
        },
        {
            type: 'Clothing',
            value: 18,
        },
        {
            type: 'Shoes',
            value: 15,
        },
        {
            type: 'Food',
            value: 10,
        },
        {
            type: 'Cosmetice',
            value: 5,
        },
    ];

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.5,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}%',
            style: {
                textAlign: 'center',
                fontSize: 16,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 18,
                },
                content: '18,935\nsales',
            },
        },
    };

    // @ts-ignore
    return <Pie {...config} />;
};
export default CategoriesChart;