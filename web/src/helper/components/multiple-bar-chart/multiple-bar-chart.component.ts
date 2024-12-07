import { Component, Input, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'helper-multiple-bar-chart',
  standalone: true,
  templateUrl: './multiple-bar-chart.component.html',
  styleUrls: ['./multiple-bar-chart.component.scss'],
})
export class HelperMultipleBarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any[]; // Expecting data to be an array of series data
  @Input() categories: string[]; // Categories for x-axis

  chartId: string; // Unique ID for the chart
  myChart: any;    // ECharts instance

  constructor() {
    // Generate a unique ID for each chart instance
    this.chartId = `bar-chart-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  // Initialize the chart
  initChart(): void {
    const chartDom = document.getElementById(this.chartId)!;
    this.myChart = echarts.init(chartDom);

    const colors = ['#075985', '#14B8A6']; // Dark blue and cyan colors

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: this.data.map((item: any) => item.name),
        bottom: '2%',
        left: 'center',
        orient: 'horizontal',
        textStyle: {
          color: '#333',
          fontSize: 14,
        },
      },
      toolbox: {
        show: false, // Hide the toolbox entirely
      },
      grid: {
        left: '5%', // Increase space on the left side
        right: '5%', // Increase space on the right side
        bottom: '15%', // Increase space on the bottom side
        top: '10%', // Adjust space on the top if needed
      },
      xAxis: {
        type: 'category',
        data: this.categories,
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          rotate: 0, // Ensure labels are not rotated
          formatter: (value: string) => value,
        },
      },
      yAxis: {
        type: 'value'
      },
      series: this.data.map((item: any, index: number) => ({
        name: item.name,
        type: 'bar',
        data: item.data,
        itemStyle: {
          color: colors[index % colors.length] // Assign color from the colors array
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
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
