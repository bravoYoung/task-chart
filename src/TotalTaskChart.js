/**
 * 全模块统计图
 */

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

const colors = ['#80b3ff', '#FF8A80', '#ffb84d', '#FFAB91']

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

    const {
      totalAmount,
      totalPage,
      returnAmount
    } = this.state

    const totalAmountSeries = {
      name: '总卷数/质检发现合格卷数',
      type: 'bar',
      stack: 'scan',
      data: [...totalAmount.slice(0, 4), returnAmount[4]],
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
            case 2: return params.value + `卷 \n\n (${totalPage[2]}页)`;
            case 3: return params.value + `卷 \n\n (${totalPage[3]}页)`;
            case 4: return params.value+ `卷`;
          }
          return params.value
        },
      },
      itemStyle: {
        normal: {
          color: param => {
            if (param.name === '质检管理') {
              return colors[3]
            }
            return colors[0]
          }
        }
      }
    }
    const returnAmountSeries = {
      name: '被退回卷数/质检发现不合格卷数',
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
          }

          if (param.name === '质检管理') {
            return param.value + `卷 \n\n (${totalPage[4]}页)`
          }
          
          return param.value + '卷'
        }
      },
      data: [...returnAmount.slice(0, 4), totalAmount[4]],
      itemStyle: {
        normal: {
          color: param => {
            if (param.name === '质检管理') {
              return colors[0]
            }
            return colors[1]
          }
        }
      }
    }
    const seriesConfig = [returnAmountSeries, totalAmountSeries]

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
            if (data[i].axisValue === '质检管理') {
              if (i === 0) {
                str = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colors[3]};\"></span> 质检发现合格卷数</p> <p style="font-weight: bold;">${data[i].value}卷</p></div>`
              } else {
                str = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;">${data[i].marker} 质检发现不合格卷数</p> <p style="font-weight: bold;">${data[i].value}卷</p></div>`
              }
            } else {
              if (i === 0) {
                str = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;">${data[1].marker} 总卷数</p> <p style="font-weight: bold;">${data[1].value}卷</p></div>`
              } else {
                str = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;">${data[0].marker} 被退回卷数</p> <p style="font-weight: bold;">${data[0].value}卷</p></div>`
              }
            }
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
        data: [{
          name: '总卷数/质检发现合格卷数',
          itemStyle: {
            color: colors[0]
          }
        }, {
          name: '被退回卷数/质检发现不合格卷数',
          itemStyle: {
            color: colors[1]
          }
        }],
        bottom: 10,
      },
      xAxis: [
        {
          type: 'category',
          data: ['人员建库', '目录著录', '平版扫描', '影像处理', '质检管理'],
          axisLabel: {
            interval: 0,
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
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value} 卷'
          }
        }
      ],
      series: seriesConfig
    })
  }

  render() {
    console.log('totalTaskChart render')
    return (<div id = "totalTaskChart" style = {{height: '700px',width: '100%',backgroundColor: '#fff'}}></div>)
  }
}