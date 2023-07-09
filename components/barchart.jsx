import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

export default function BarChart({}) {
  const [option, setOption] = useState({});

  useEffect(() => {
    const colors = ["#A18A68", "#56496C"];
    const barOptions = {
      color: colors,
      tooltip: {
        trigger: "axis",
        // axisPointer: {
        //   type: "cross",
        // },
      },
      toolbox: {
        feature: {
          dataView: { show: false, readOnly: false },
          restore: { show: false },
          saveAsImage: { show: true },
        },
      },

      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Earnings",
          alignTicks: true,
          offset: 80,
          axisLine: {
            show: false,
            lineStyle: {
              color: colors[1],
            },
          },
          axisLabel: {
            formatter: "Ksh. {value}",
          },
        },
        {
          type: "value",
          name: "Orders",
          position: "left",
          alignTicks: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: colors[2],
            },
          },
        },
      ],
      series: [
        {
          name: "Earnings",
          type: "bar",
          itemStyle: {
            emphasis: {
              barBorderRadius: [50, 50],
            },
            normal: {
              barBorderRadius: [50, 50, 0, 0],
            },
          },
          barWidth: "40%",
          yAxisIndex: 0,
          data: [2000, 1000, 1300, 5000, 2300, 650, 1760],
        },
        {
          name: "Orders",
          type: "line",
          yAxisIndex: 1,
          data: [2, 1, 3, 2, 4, 10, 2],
        },
      ],
    };
    setOption(barOptions);
  }, []);
  return <ReactECharts option={option} />;
}
