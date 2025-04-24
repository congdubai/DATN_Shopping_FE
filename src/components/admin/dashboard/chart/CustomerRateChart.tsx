import { Bullet } from '@ant-design/charts';

const CustomerRateChart = () => {
    const data = [
        {
            title: '',
            ranges: [40, 70, 100],
            measures: [30, 70],
            target: 100,
        },
    ];
    const config = {
        data,
        measureField: 'measures',
        rangeField: 'ranges',
        targetField: 'target',
        xField: 'title',
        color: {
            range: ['#FFbcb8', '#FFe0b0', '#bfeec8'],
            measure: ['#5B8FF9', '#61DDAA'],
            target: '#39a3f4',
        },
        label: {
            measure: {
                position: 'middle',
                style: {
                    fill: '#fff',
                },
            },
        },
        xAxis: {
            line: null,
        },
        yAxis: false,
        tooltip: {
            showMarkers: false,
            shared: true,
        },
        // customize legend
        legend: {
            custom: true,
            position: 'bottom',
            items: [
                {
                    value: 'First time',
                    name: 'First time buying',
                    marker: {
                        symbol: 'square',
                        style: {
                            fill: '#5B8FF9',
                            r: 5,
                        },
                    },
                },
                {
                    value: 'Returning',
                    name: 'Returning',
                    marker: {
                        symbol: 'square',
                        style: {
                            fill: '#61DDAA',
                            r: 5,
                        },
                    },
                },
            ],
        },
    };
    // @ts-ignore
    return <Bullet {...config} />;
};
export default CustomerRateChart;