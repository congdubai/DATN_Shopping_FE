import { ApexOptions } from "apexcharts";

interface LineChartType {
    series: {
        name: string;
        data: number[];
        offsetY?: number;
    }[];
    options: ApexOptions;
}

const lineChart: LineChartType = {
    series: [
        {
            name: "Mobile apps",
            data: [350, 40, 300, 220, 500, 250, 400, 230, 500],
        },
        {
            name: "Websites",
            data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
        },
    ],
    options: {
        chart: {
            width: "100%",
            height: 350,
            type: "area", // chính xác: "area" là một union type chứ không phải string tự do
            toolbar: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "14px",
                    fontWeight: 600,
                    colors: ["#8c8c8c"],
                },
            },
        },
        xaxis: {
            labels: {
                style: {
                    fontSize: "14px",
                    fontWeight: 600,
                    colors: Array(9).fill("#8c8c8c"),
                },
            },
            categories: [
                "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
            ],
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val.toString();
                },
            },
        },
    },
};

export default lineChart;
