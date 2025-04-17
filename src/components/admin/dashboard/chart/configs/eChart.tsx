import { ApexOptions } from "apexcharts";

const eChart: {
    series: ApexAxisChartSeries;
    options: ApexOptions;
} = {
    series: [
        {
            name: "Sales",
            data: [450, 200, 100, 220, 500, 100, 400, 230, 500],
            color: "#fff",
        },
    ],

    options: {
        chart: {
            type: "bar",
            width: "100%",
            height: "auto",

            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 1,
            colors: ["transparent"],
        },
        grid: {
            show: true,
            borderColor: "#ccc",
            strokeDashArray: 2,
        },
        xaxis: {
            categories: [
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
            ],
            labels: {
                show: true,
                rotate: -45, // Thay thế align bằng rotate để xoay nhãn nếu cần
                style: {
                    colors: Array(9).fill("#fff"),
                },
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    colors: Array(9).fill("#fff"),
                },
            },
        },

        tooltip: {
            y: {
                formatter: function (val: number): string {
                    return "$ " + val + " thousands";
                },
            },
        },
    },
};

export default eChart;
