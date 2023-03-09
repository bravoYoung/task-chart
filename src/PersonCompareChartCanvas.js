/**
 * 人员对比统计图
 */

import React, {
  Component
} from 'react'
import {
  Divider,
  Empty
} from 'antd'
import * as echarts from 'echarts'
import chartData from './data'
import {
  sum
} from './getDates'
import {
  COLORS
} from './CONSTANTS'

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}

let personCompareChart;

export default class PersonCompareChartCanvas extends Component {
  constructor(props) {
    super(props);
    
    let totalAmount = []
    let returnAmount = []
    let returnRate = []
    let totalPage = []
    let yAxisTxt = []
    let personListChart = chartData.personListChart
    let chartDataType = props.chartDataType
    let formatPersonList = []
    let groupReturnRate = 0

    personListChart.map(obj => {
      let personName = Object.keys(obj)[0]
      let personData = {}

      if (obj[personName] && obj[personName][props.template] && obj[personName][props.template][chartDataType]) {
        personData.name = personName
        personData.totalAmount = obj[personName][props.template][chartDataType].totalAmount
        personData.returnAmount = obj[personName][props.template][chartDataType].returnAmount
        personData.totalPage = obj[personName][props.template][chartDataType].totalPage
        formatPersonList.push(personData)
      }
    })

    formatPersonList.sort((a, b) => {
      return b.totalPage - a.totalPage
    })

    formatPersonList.map(v => {
      yAxisTxt.push(v.name)
      totalAmount.push(v.totalAmount)
      returnAmount.push(v.returnAmount)
      totalPage.push(v.totalPage)
      returnRate.push(Math.round(((Math.abs(v.returnAmount) / Math.abs(v.totalAmount)).toFixed(2)) * 100))
    })

    if (props.template !== 'zj') {
      let groupTotalAmount = sum(totalAmount)
      let groupReturnAmount = sum(returnAmount)
      groupReturnRate = Math.round(((groupReturnAmount / groupTotalAmount).toFixed(2)) * 100)

      console.log(returnRate)
    }
    
    this.state = {
      templateTxt: template[props.template] || '',
      legendTxt: [`${props.template === 'zj' ? '发现合格卷数' : '总卷数'}`, `${props.template === 'zj' ? '发现不合格卷数' : '被退回卷数'}`, '总页数', '被退回率'],
      template: props.template,
      datesRangeTxt: props.datesRangeTxt || '',
      datesRange: props.datesRange,
      totalAmount,
      returnAmount,
      returnRate,
      totalPage,
      yAxisTxt,
      groupReturnRate
    };
  }

  componentWillReceiveProps(nextProps) {
    
    let totalAmount = []
    let returnAmount = []
    let returnRate = []
    let totalPage = []
    let yAxisTxt = []
    let personListChart = chartData.personListChart
    let chartDataType = nextProps.chartDataType
    let formatPersonList = []
    let groupReturnRate = 0

    personListChart.map(obj => {
      let personName = Object.keys(obj)[0]

      let personData = {}

      if (obj[personName] && obj[personName][nextProps.template] && obj[personName][nextProps.template][chartDataType]) {
        personData.name = personName
        personData.totalAmount = obj[personName][nextProps.template][chartDataType].totalAmount
        personData.returnAmount = obj[personName][nextProps.template][chartDataType].returnAmount
        personData.totalPage = obj[personName][nextProps.template][chartDataType].totalPage
        formatPersonList.push(personData)
      }
    })

    formatPersonList.sort((a, b) => {
      return b.totalPage - a.totalPage
    })

    formatPersonList.map(v => {
      yAxisTxt.push(v.name)
      totalAmount.push(v.totalAmount)
      returnAmount.push(v.returnAmount)
      totalPage.push(v.totalPage)
      returnRate.push(Math.round(((Math.abs(v.returnAmount) / Math.abs(v.totalAmount)).toFixed(2)) * 100))
    })

    if (nextProps.template !== 'zj') {
      let groupTotalAmount = sum(totalAmount)
      let groupReturnAmount = sum(returnAmount)
      groupReturnRate = Math.round(((groupReturnAmount / groupTotalAmount).toFixed(2)) * 100)
    }

    this.setState({
      templateTxt: template[nextProps.template] || '',
      template: nextProps.template,
      legendTxt: [`${nextProps.template === 'zj' ? '发现合格卷数' : '总卷数'}`, `${nextProps.template === 'zj' ? '发现不合格卷数' : '被退回卷数'}`, '总页数', '被退回率'],
      datesRangeTxt: nextProps.datesRangeTxt || '',
      datesRange: nextProps.datesRange,
      totalAmount,
      returnAmount,
      returnRate,
      totalPage,
      yAxisTxt,
      groupReturnRate
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

  getyAxisConfig = () => {
    const {
      legendTxt,
      template
    } = this.state

    let yAxisConfig = [
      {
        type: 'value',
        name: '卷数',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: COLORS[0]
          }
        },
        axisLabel: {
          formatter: '{value} 卷'
        },
        position: 'bottom',
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: '页数',
        alignTicks: true,
        axisTick: {
          show: true,
          alignWithLabel: true,
          inside: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: COLORS[2]
          } 
        },
        axisLabel: {
          formatter: '{value} 页'
        },
        position: 'top',
        splitLine: {
          show: false
        }
      }
    ]

    if (template !== 'zj') {
      let returnRateAxis = {
        type: 'value',
        name: legendTxt[3],
        alignTicks: true,
        axisTick: {
          show: true,
          alignWithLabel: true,
          inside: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: COLORS[1]
          } 
        },
        axisLabel: {
          formatter: '{value} %'
        },
        position: 'right',
        offset: 100,
        splitLine: {
          show: false
        }
      }
      yAxisConfig.push(returnRateAxis)
    }

    return yAxisConfig
  }

  getSeriesConfig = () => {
    const {
      template,
      totalAmount,
      returnAmount,
      totalPage,
      returnRate,
      groupReturnRate,
      legendTxt
    } = this.state

    let totalAmountSeries = {
      name: this.state.legendTxt[0],
      type: 'bar',
      barWidth: '40%',
      stack: 'scan',
      label: {
        show: false,
        position: 'insideRight',
        textStyle: {
          color: '#424242'
        }
      },
      itemStyle: {
        color: COLORS[0]
      },
      data: this.state.totalAmount,
      markLine: {
        show: false,
        lineStyle: {
          opacity: 0
        }
      }
    }
    let returnAmountSeries = {
      name: legendTxt[1],
      type: 'bar',
      stack: 'scan',
      barWidth: '40',
      label: {
        show: false,
        position: 'insideTop',
        textStyle: {
          color: '#424242'
        }
      },
      itemStyle: {
        color: template === 'zj' ? COLORS[3] : COLORS[1]
      },
      yAxisIndex: 0,
      data: returnAmount,
      markLine: {
        show: false,
        lineStyle: {
          opacity: 0
        }
      }
    }
    let totalPageSeries = {
      name: legendTxt[2],
      type: 'line',
      // stack: 'scan',
      label: {
        show: false,
        position: 'insideTop',
        textStyle: {
          color: '#424242'
        },
        formatter: (params) => {
          let { dataIndex } = params
          return params.value + `页 \n\n (${totalAmount[dataIndex]}卷)`
        },
      },
      itemStyle: {
        color: COLORS[2]
      },
      yAxisIndex: 1,
      interval: 8,
      data: totalPage,
      markPoint: {
        data: [
          {
            value: '',
            symbol: "image://" + require('./images/1.png'),
            symbolSize: 45,
            symbolRotate: -30,
            coord: [0, totalPage[0] + (totalPage[0] * 0.04)]
          },
          {
            value: '',
            symbol: "image://" + require('./images/2.png'),
            symbolSize: 45,
            symbolRotate: -30,
            coord: [1, totalPage[1] + (totalPage[0] * 0.04)]
          },
          {
            value: '',
            symbol: "image://" + require('./images/3.png'),
            symbolSize: 45,
            symbolRotate: -30,
            coord: [2, totalPage[2] + (totalPage[0] * 0.04)]
          }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: '工作量平均值' }],
        label: {
          show: true,
          color: COLORS[2],
          formatter: param => {
            return `工作量平均值 ${Math.floor(param.value)} 页`
          }
        }
      }
    }
    let returnRateSeries = {
      name: legendTxt[3],
      type: 'line',
      label: {
        show: false,
        textStyle: {
          color: '#424242'
        }
      },
      itemStyle: {
        color: COLORS[1]
      },
      yAxisIndex: 2,
      data: returnRate,
      markLine: {
        data: template !== 'zj' ? [{ type: 'average', name: '被退回率平均值' }] : null,
        label: {
          show: template !=='zj',
          color: COLORS[1],
          formatter: param => {
            if (template === 'zj') {
              return ``
            }
            return `被退回率平均值 ${param.value}%`
          }
        },
        lineStyle: {
          opacity: template !== 'zj'
        }
      }
    }
    
    let seriesConfig = []

    if (template !== 'zj') {
      seriesConfig = []
      seriesConfig = [returnAmountSeries, totalAmountSeries, totalPageSeries, returnRateSeries]
    } else {
      seriesConfig = []
      seriesConfig = [totalAmountSeries, returnAmountSeries, totalPageSeries]
    }

    return seriesConfig
  }

  getOption = () => {
    // let personCompareChart = echarts.init(document.getElementById('PersonCompareChartCanvas'));

    if (personCompareChart !== null && personCompareChart !== '' && personCompareChart !== undefined) {
      personCompareChart.dispose()
    }
    personCompareChart = echarts.init(document.getElementById('PersonCompareChartCanvas'));

    const {
      template,
      totalAmount,
      returnAmount,
      totalPage,
      returnRate,
      groupReturnRate,
      legendTxt
    } = this.state

    personCompareChart.resize()
    const waterMarkText = 'ECHARTS';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 100;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.08;
    ctx.font = '20px Microsoft Yahei';
    ctx.translate(50, 50);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(waterMarkText, 0, 0);

    personCompareChart.setOption({
      color: COLORS,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: data => {
          let relVal = `<p style="margin: 0;padding: 0;font-size: 16px;">${data[0].name}</p>`
          let dataIndex = data[0].dataIndex
          
          let totalAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[0]};"></span> ${legendTxt[0]}</p> <p style="font-weight: bold;">${totalAmount[dataIndex]}卷</p></div>`
          let returnAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[1]};"></span> ${legendTxt[1]}</p> <p style="font-weight: bold;">${returnAmount[dataIndex]}卷</p></div>`
          let returnRateStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[1]};"></span> ${legendTxt[3]}</p> <p style="font-weight: bold;">${returnRate[dataIndex]}%</p></div>`
          let totalPageStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[2]};"></span> ${legendTxt[2]}</p> <p style="font-weight: bold;">${totalPage[dataIndex]}页</p></div>`
          
          return template === 'zj' ? (relVal + totalAmountStr + returnAmountStr + totalPageStr) : (
            relVal + totalAmountStr + returnAmountStr + returnRateStr + totalPageStr
          )
        }
      },
      legend: {
        data: this.state.legendTxt,
        bottom: 10
      },
      title: [
        {
          text: `${this.state.templateTxt}工作量统计`,
          subtext: `${this.state.datesRangeTxt}`,
          textAlign: 'center',
          left: '50%',
          textStyle: {
            fontSize: 18
          }
        }
      ],
      grid: [
        {
          top: '100',
          width: '85%',
          // bottom: 80,
          left: 80,
          containLabel: true
        }
      ],
      yAxis: this.getyAxisConfig(),
      xAxis: [
        {
          type: 'category',
          data: this.state.yAxisTxt,
          axisLabel: {
            interval: 0,
            rotate: 30,
            textStyle: {
              fontSize: 14
            }
          }
        }
      ],
      series: this.getSeriesConfig()
    })
  }

  render() {
    return (
      <div>
        <div id="PersonCompareChartCanvas" style={{height: '760px',width: '100%',backgroundColor: '#fff', display: this.state.totalAmount.length ? 'block' : 'none'}}></div>
        {
          this.state.totalAmount.length ? <div></div> : <Empty style={{marginTop: '250px'}} description={'暂无数据'} />
        }
      </div>
    )
  }
}