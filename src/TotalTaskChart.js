import React, {
  Component
} from 'react'
import * as echarts from 'echarts'
import chartData from './data'
import './index.css';

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}



export default class TotalTaskChart extends Component {
  constructor(props) {
    super(props);

    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    
    totalAmount = chartData.totalChart[props.chartDataType].totalAmount
    returnAmount = chartData.totalChart[props.chartDataType].returnAmount
    totalPage = chartData.totalChart[props.chartDataType].totalPage
      
    this.state = {
      templateTxt: template[props.template] || '',
      datesRangeTxt: props.datesRangeTxt || '',
      datesRange: props.datesRange,
      chartDataType: props.chartDataType,
      totalAmount,
      returnAmount,
      totalPage,
    };
  }

  componentWillReceiveProps(nextProps) {
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    
    totalAmount = chartData.totalChart[nextProps.chartDataType].totalAmount
    returnAmount = chartData.totalChart[nextProps.chartDataType].returnAmount
    totalPage = chartData.totalChart[nextProps.chartDataType].totalPage

    this.setState({
      templateTxt: template[nextProps.template] || '',
      datesRangeTxt: nextProps.datesRangeTxt || '',
      datesRange: nextProps.datesRange,
      chartDataType: nextProps.chartDataType,
      totalAmount,
      returnAmount,
      totalPage
    })
    setTimeout(() => {
      this.getOption()
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.getOption()
    })
  }

  getOption = () => {
    
    var myChart = echarts.init(document.getElementById('totalTaskChart'));
    myChart.resize()

    const colors = ['#FF8A80', '#80b3ff', '#ffb84d'];

    myChart.setOption({
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: data => {
          let relVal = `<p style="margin: 0;padding: 0;font-size: 16px;">${data[0].name}</p>`
          data.map((v, i) => {
            let str = ''
            str = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;">${data[i].marker} ${data[i].seriesName}</p> <p style="font-weight: bold;">${data[i].value}卷</p></div>`
            relVal += str
          })
          let dataIndex = data[0].dataIndex
          relVal += `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ffb84d;"></span> 总页数</p> <p style="font-weight: bold;">${this.state.totalPage[dataIndex]}页</p></div>`
          return relVal
        }
      },
      grid: {
        right: '20%',
        top: '10%'
      },
      title: [
        {
          text: '全模块工作量统计',
          subtext: `${this.state.datesRangeTxt}`,
          textAlign: 'center',
          left: '50%',
          textStyle: {
            fontSize: 18
          }
        }
      ],
      legend: {
        data: ['总卷数', '被退回卷数'],
        bottom: 10,
      },
      xAxis: [
        {
          type: 'category',
          data: ['人员建库', '目录著录', '平版扫描', '影像处理', '质检管理'],
          axisLabel: {
            interval: 0,
            // rotate: 30,
            textStyle: {
              fontSize: 14
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '卷数',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel: {
            formatter: '{value} 卷'
          }
        }
      ],
      series: [
        {
          name: '被退回卷数',
          type: 'bar',
          barWidth: '66',
          stack: 'scan',
          label: {
            show: true,
            position: 'insideTop',
            textStyle: {
              color: '#424242'
            },
            formatter: param => {
              if (param.value == 0) {
                return ' '
              } else {
                return param.value + '卷'
              }
            }
          },
          data: this.state.returnAmount,
        },
        {
          name: '总卷数',
          type: 'bar',
          // barWidth: '20%',
          stack: 'scan',
          label: {
            show: true,
            position: 'insideTop',
            textStyle: {
              color: '#424242'
            },
            formatter: (params) => {
              switch(params.dataIndex) {
                case 0: return params.value + `卷`;
                case 1: return params.value + `卷`;
                case 2: return params.value + `卷 \n\n (${this.state.totalPage[2]}页)`;
                case 3: return params.value + `卷 \n\n (${this.state.totalPage[3]}页)`;
                case 4: return params.value + `卷 \n\n (${this.state.totalPage[4]}页)`;
              }
              return params.value
            },
          },
          data: this.state.totalAmount
        }
      ]
    })
  }

  render() {
    console.log('totalTaskChart render')
    return (<div id = "totalTaskChart" style = {{height: '700px',width: '100%',backgroundColor: '#fff'}}></div>)
  }
}