import { Component, Input, OnInit, AfterViewInit, OnDestroy, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'helper-line-chart-V2',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class HelperLineChartComponentV2 implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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

  // Detect changes in input properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data || changes.categories) {
      this.updateChart();
    }
  }

  // Initialize the chart
  initChart(): void {
    const chartDom = document.getElementById(this.chartId)!;
    this.myChart = echarts.init(chartDom);
    this.updateChart(); // Set the initial chart data
  }
 // Update the chart with new data
// Update the chart with new data
  updateChart(): void {
    if (!this.myChart) return; // Ensure myChart is initialized

    // Define a specific set of colors for the lines
    const predefinedColors = [
        '#86efac', // color 1
        '#319795', // color 2
        '#63b3ed', // color 3
        '#ff6361', // color 4
        '#ffa600', // color 5
        '#bc5090'  // color 6
    ];

    // Limit the colors to the number of datasets available
    const colors = predefinedColors.slice(0, Math.max(this.data.length, 6)); // Ensure a max of 6 colors

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
            left: '4%',
            orient: 'horizontal',
            textStyle: {
                color: '#333',
                fontSize: 16,
                fontFamily: 'Kantumruy Pro', // Set the font family here
            },
            itemWidth: 20, // Increase the width of the legend items
            itemHeight: 20, // Increase the height of the legend items
            symbol: 'circle', // Set legend item shape to circle
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
                fontFamily: 'Kantumruy Pro', // Optional: Set font for x-axis labels
            },
            boundaryGap: false, // Ensure the line starts at x=0 without any gap
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontFamily: 'Kantumruy Pro', // Optional: Set font for y-axis labels
            },
        },
        series: this.data.map((item: any, index: number) => ({
            name: item.name,
            type: 'line',
            data: item.data,
            smooth: true,
            symbol: 'circle', // Ensure data point symbols are circles
            symbolSize: 12, // Increase the size of the circles
            lineStyle: {
                width: 3,
                color: colors[index % colors.length], // Use predefined colors, wrapping around if necessary
            },
            itemStyle: {
                borderWidth: 2,
                color: colors[index % colors.length], // Use predefined colors, wrapping around if necessary
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
