import { Component, Input, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'helper-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class HelperLineChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any[]; // Expecting data to be an array with two datasets
  @Input() categories: string[]; // Categories for x-axis

  chartId: string; // Unique ID for the chart
  myChart: any;    // ECharts instance

  constructor() {
    // Generate a unique ID for each chart instance
    this.chartId = `line-chart-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  // Initialize the chart
  initChart(): void {
  const chartDom = document.getElementById(this.chartId)!;
  this.myChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: this.data.map((item: any) => item.name),
      bottom: '4%',
      left: 'center',
      orient: 'horizontal',
      textStyle: {
        color: '#333',
        fontSize: 14,
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: this.categories,
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        rotate: 0,
        formatter: (value: string) => value,
      },
      boundaryGap: false, // Ensure the line starts at x=0 without any gap
    },
    yAxis: {
      type: 'value'
    },
    series: this.data.map((item: any, index: number) => ({
      name: item.name,
      type: 'line',
      data: item.data,
      smooth: true,
      lineStyle: {
        width: 3,
        color: index === 0 ? '#0b9043' : '#f01811',
      },
      symbolSize: 8,
      itemStyle: {
        borderWidth: 2,
        color: index === 0 ? '#0b9043' : '#f01811',
      },
    })),
  };

  this.myChart.setOption(option);
}


  // Handle window resize and resize the chart accordingly
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (this.myChart) {
      this.myChart.resize(); // Resize the chart on window resize
    }
  }

  // Cleanup: Dispose of the chart instance when the component is destroyed
  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.dispose(); // Clean up the chart instance
    }
  }
}
