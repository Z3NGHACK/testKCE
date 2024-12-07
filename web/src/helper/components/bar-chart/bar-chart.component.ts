import { Component, Input, OnInit, AfterViewInit, OnDestroy, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'helper-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class HelperBarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() label: any[] = [];
  @Input() data: any[] = [];

  chartId: string; // Unique ID for the chart
  myChart: any; // ECharts instance

  constructor() {
    // Generate a unique ID for each chart instance
    this.chartId = `bar-chart-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  // Detect changes in @Input data and update chart
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.label || changes.data) {
      this.updateChart();
    }
  }

  // Initialize the chart
  initChart(): void {
    const chartDom = document.getElementById(this.chartId)!;  // Use the unique chart ID
    this.myChart = echarts.init(chartDom);
    this.setChartOptions();
  }

  // Set chart options
  setChartOptions(): void {
    const option = {
      // Global text style
      textStyle: {
        fontFamily: 'Kantumruy Pro', // Apply font to the whole chart
        fontSize: 18,
        color: '#333', // Set global text color
      },
      
      xAxis: {
        type: 'category',
        data: this.label,
        axisLabel: {
          textStyle: {
            color: '#333',
            fontFamily: 'Kantumruy Pro', // Set the font family here
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#333',
            fontFamily: 'Kantumruy Pro', // Set the font family here
          },
        },
      },
      
      grid: {
        left: '10%', // Increase space on the left side
        right: '5%', // Increase space on the right side
        bottom: '20%', // Increase space on the bottom side
        top: '10%', // Adjust space on the top if needed
      },
      
      series: [
        {
          data: this.data,
          type: 'bar',
          barWidth: '40%', // Thinner bars
          itemStyle: {
            color: '#4CAF50', // Green color
          },
          label: {
            show: true, // Show the label
            position: 'top', // Position the label on top of the bars
            textStyle: {
              color: '#333',
              fontFamily: 'Kantumruy Pro', // Set the font family for labels
              fontSize: 14, // Set the font size for the label
            },
          },
        },
      ],
      
      legend: {
        textStyle: {
          fontFamily: 'Kantumruy Pro', // Set the font family for the legend
          fontSize: 16,
          color: '#333',
        },
      },
      
      tooltip: {
        textStyle: {
          fontFamily: 'Kantumruy Pro', // Set the font family for the tooltip
          fontSize: 16,
          color: '#333',
        },
      },
    };
  
    this.myChart.setOption(option);
  }
  

  // Update the chart data dynamically
  updateChart(): void {
    if (this.myChart) {
      this.setChartOptions(); // Update the options with new data
      this.myChart.resize();  // Ensure the chart resizes after data update
    }
  }

  // Listen to window resize events and trigger chart resize
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (this.myChart) {
      this.myChart.resize(); // Resize the chart when the window size changes
    }
  }

  // Cleanup: Destroy the chart instance when the component is destroyed
  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.dispose(); // Dispose of the chart instance to avoid memory leaks
    }
  }
}
