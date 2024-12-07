import { Component, Input, OnInit, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'helper-semi-pie-chart',
  standalone: true,
  templateUrl: './semi-piechart.component.html',
  styleUrls: ['./semi-piechart.component.scss'],
})
export class HelperSemiPieChartComponent implements OnInit, AfterViewInit, OnChanges {
  
  @Input() data: any[] = [];  // Initialize as an empty array
  @Input() value: any;
  chartId: string;
  myChart: any;

  constructor() {
    // Generate a unique ID for each chart instance
    this.chartId = `pie-chart-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      this.updateChart(); // Method to update chart based on new data
    }
  }

  updateChart(): void {
    if (this.myChart) {
      const option = this.getChartOptions();
      this.myChart.setOption(option);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const chartDom = document.getElementById(this.chartId)!;
    this.myChart = echarts.init(chartDom);

    const option = this.getChartOptions();
    this.myChart.setOption(option);
  }

  getChartOptions() {

  
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        top: '60%',
        left: 'center',
        orient: 'horizontal',
        itemWidth: 10, 
        itemHeight: 10, 
        itemGap: 8, 
        padding: [0, 0, 0, 0],
        textStyle: {
            color: '#333',
            fontSize: 15, 
            fontFamily: 'Kantumruy Pro',
        },
        icon: 'circle', 
        formatter: (name: string) => {
            const dataItem = this.data.find((item: any) => item.name === name);
            return `${name} ( ${dataItem ? dataItem.value : ''} )`;
        },
    },
    
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['55%', '95%'],
          center: ['50%', '50%'],
          startAngle: 180,
          endAngle: 360,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            color: '#fff',
            fontSize: 16,
          },
          data: this.data,
        },
      ],
    };
  }
  
  
  
}
