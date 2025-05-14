import { Area } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ISaleSummary } from '@/types/backend';
import { callFetchISaleChannelSummary } from '@/config/api';

interface SaleChartProps {
    dateRange8?: [Dayjs, Dayjs];
}

const SalesChart: React.FC<SaleChartProps> = ({ dateRange8 }) => {
    const [data, setData] = useState<ISaleSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!dateRange8) return;

                setLoading(true);
                const [start, end] = dateRange8;

                const res = await callFetchISaleChannelSummary(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );

                const sortedData = res.data!
                    .map(item => ({
                        ...item,
                        order: item.country === 'Tại cửa hàng' ? 0 : 1,
                    }))
                    .sort((a, b) => a.order - b.order);

                setData(sortedData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange8]);

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'country',
        loading,
        meta: {
            value: {
                formatter: (v: number) => `${v.toLocaleString('vi-VN')} đ`,
            },
        },
        tooltip: {
            formatter: (datum: any) => ({
                name: datum?.country ?? '',
                value: `${(datum?.value ?? 0).toLocaleString('vi-VN')} đ`,
            }),
        },
        slider: {
            start: 0.1,
            end: 0.9,
        },
    };

    return <Area {...config} />;
};

export default SalesChart;
