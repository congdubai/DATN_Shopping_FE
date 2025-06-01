import { callFetchCategorySaleByDay } from '@/config/api';
import { ICategorySeller } from '@/types/backend';
import { Pie } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

interface CategoriesChartProps {
    dateRange6?: [Dayjs, Dayjs];
}

const CategoriesChart: React.FC<CategoriesChartProps> = ({ dateRange6 }) => {
    const [data, setData] = useState<ICategorySeller[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!dateRange6) return;

            setLoading(true);
            const [start, end] = dateRange6;

            try {
                const res = await callFetchCategorySaleByDay(
                    start.startOf('day').toISOString(),
                    end.endOf('day').toISOString()
                );

                if (res.data && res.data.length > 0) {
                    const total = res.data.reduce((acc: number, cur: ICategorySeller) => acc + cur.value, 0);
                    const processed = res.data.map((item: ICategorySeller) => ({
                        ...item,
                        percent: item.value / total,
                    }));
                    setData(processed);
                }
                else {
                    setData([]);
                }
            } catch (error) {
                console.error("Fetch category sales failed:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange6]);

    const totalSales = data.reduce((acc, cur) => acc + cur.value, 0);

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
            content: (datum: any) => `${(datum.percent * 100).toFixed(2)}%`,
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
                content: `${totalSales}\nsales`,
            },
        },
    };

    // @ts-ignore
    return <Pie {...config} loading={loading} />;
};

export default CategoriesChart;
