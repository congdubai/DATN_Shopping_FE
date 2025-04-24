import { Area } from '@ant-design/charts';

const SalesChart = () => {
    const data = [
        {
            country: 'Online Store',
            date: 'Jan',
            value: 1390.5,
        },
        {
            country: 'Online Store',
            date: 'Feb',
            value: 1469.5,
        },
        {
            country: 'Online Store',
            date: 'Mar',
            value: 1521.7,
        },
        {
            country: 'Online Store',
            date: 'Apr',
            value: 1615.9,
        },
        {
            country: 'Online Store',
            date: 'May',
            value: 1703.7,
        },
        {
            country: 'Online Store',
            date: 'Jun',
            value: 1767.8,
        },
        {
            country: 'Online Store',
            date: 'Jul',
            value: 1806.2,
        },
        {
            country: 'Online Store',
            date: 'Aug',
            value: 1903.5,
        },
        {
            country: 'Online Store',
            date: 'Sept',
            value: 1986.6,
        },
        {
            country: 'Online Store',
            date: 'Oct',
            value: 1952,
        },
        {
            country: 'Online Store',
            date: 'Nov',
            value: 1910.4,
        },
        {
            country: 'Online Store',
            date: 'Dec',
            value: 2015.8,
        },
        {
            country: 'Facebook',
            date: 'Jan',
            value: 109.2,
        },
        {
            country: 'Facebook',
            date: 'Feb',
            value: 115.7,
        },
        {
            country: 'Facebook',
            date: 'Mar',
            value: 120.5,
        },
        {
            country: 'Facebook',
            date: 'Apr',
            value: 128,
        },
        {
            country: 'Facebook',
            date: 'May',
            value: 134.4,
        },
        {
            country: 'Facebook',
            date: 'Jun',
            value: 142.2,
        },
        {
            country: 'Facebook',
            date: 'Jul',
            value: 157.5,
        },
        {
            country: 'Facebook',
            date: 'Aug',
            value: 169.5,
        },
        {
            country: 'Facebook',
            date: 'Sept',
            value: 186.3,
        },
        {
            country: 'Facebook',
            date: 'Oct',
            value: 195.5,
        },
        {
            country: 'Facebook',
            date: 'Nov',
            value: 198,
        },
        {
            country: 'Facebook',
            date: 'Dec',
            value: 211.7,
        },
    ];

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'country',
        slider: {
            start: 0.1,
            end: 0.9,
        },
    };

    return <Area {...config} />;
};
export default SalesChart;