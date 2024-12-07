import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'helper-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class HelperPieChartComponent implements OnInit, AfterViewInit {
  @Input() data: any[];
  @Input() value: string;  // Data for the pie chart
  chartId: string;

  constructor() {
    // Generate a unique ID for each chart instance
    this.chartId = `pie-chart-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const chartDom = document.getElementById(this.chartId)!;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)', // Display name, value, and percentage in tooltip
      },
      legend: {
        bottom: '8%',  // Position the legend at the bottom
        left: 'center',
        orient: 'horizontal',
        textStyle: {
          color: '#333',
          fontSize: 14,
        },
        formatter: (name: string) => {
            const dataItem = option.series[0].data.find((item: any) => item.name === name);
            return `${name} ( ${dataItem ? dataItem.value : ''} )`;
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['55%', '80%'],  // Define the radius of the pie chart
          center: ['50%', '37%'],  // Adjusted to move the chart down
          label: {
            show: true,
            position: 'inside',  // Position labels inside the pie
            formatter: '{d}%',  // Display percentage inside the pie
            color: '#fff',  // Color of the percentage text
            fontSize: 14,
          },
          labelLine: {
            show: false  // Hide label lines
          },
          data: this.data,
        },
      ],
    };

    myChart.setOption(option);
  }
}
