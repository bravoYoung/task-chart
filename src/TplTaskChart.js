/**
 * 三个功能模块统计图
 */

import React, {
  Component
} from 'react'
import {
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

export default class TplTaskChart extends Component {
  constructor(props) {
    super(props);

    console.log('props in TplTaskChart', props)
    
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let data = chartData.tplChart[props.template]
    let returnRate = []

    if(props.datesRange && props.datesRange.length) {
      props.datesRange.map(d => {
        if(data[d] && data[d].totalAmount) {
          yAxisTxt.push(d)
          totalAmount.push(data[d].totalAmount)
          returnAmount.push(data[d].returnAmount)
          totalPage.push(data[d].totalPage)
          returnRate.push(Math.round(((Math.abs(data[d].returnAmount) / Math.abs(data[d].totalAmount)).toFixed(2)) * 100))
        }
      })
    }
    
    
    this.state = {
      template: props.template,
      templateTxt: template[props.template] || '',
      legendTxt: props.template !== 'zj' ? ['总卷数', '被退回卷数', '总页数'] : ['质检发现合格卷数', '质检发现不合格卷数', '总页数'],
      datesRangeTxt: props.datesRangeTxt || '',
      datesRange: props.datesRange,
      totalAmount,
      returnAmount,
      totalPage,
      returnRate,
      yAxisTxt
    };
  }

  componentWillReceiveProps(nextProps) {
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let data = chartData.tplChart[nextProps.template]
    let returnRate = []

    if(nextProps.datesRange && nextProps.datesRange.length) {
      nextProps.datesRange.map(d => {
        if(data[d] && data[d].totalAmount) {
          yAxisTxt.push(d)
          totalAmount.push(data[d].totalAmount)
          returnAmount.push(data[d].returnAmount)
          totalPage.push(data[d].totalPage)
          returnRate.push(Math.round(((Math.abs(data[d].returnAmount) / Math.abs(data[d].totalAmount)).toFixed(2)) * 100))
        }
      })
    }
    this.setState({
      template: nextProps.template,
      templateTxt: template[nextProps.template] || '',
      legendTxt: nextProps.template !== 'zj' ? ['总卷数', '被退回卷数', '总页数'] : ['质检发现合格卷数', '质检发现不合格卷数', '总页数'],
      datesRangeTxt: nextProps.datesRangeTxt || '',
      datesRange: nextProps.datesRange,
      totalAmount,
      returnAmount,
      totalPage,
      returnRate,
      yAxisTxt
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
    let myChart = echarts.init(document.getElementById('tplTaskChart'));
    const {
      legendTxt,
      totalAmount,
      totalPage,
      returnAmount,
      template,
      returnRate
    } = this.state

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
    myChart.resize()

    const totalAmountSeries = {
      name: legendTxt[0],
      type: 'bar',
      barWidth: '40%',
      stack: 'scan',
      label: {
        show: true,
        position: 'insideRight',
        textStyle: {
          color: '#424242'
        }
      },
      itemStyle: {
        color: COLORS[0]
      },
      data: totalAmount
    }
    const returnAmountSeries = {
      name: legendTxt[1],
      type: 'bar',
      stack: 'scan',
      label: {
        show: true,
        position: 'insideRight',
        textStyle: {
          color: '#424242'
        }
      },
      itemStyle: {
        color: template === 'zj' ? COLORS[3] : COLORS[1]
      },
      data: returnAmount
    }
    const totalPageSeries = {
      name: legendTxt[2],
      type: 'line',
      label: {
        show: true,
        position: 'insideRight',
        textStyle: {
          color: '#424242'
        }
      },
      itemStyle: {
        color: COLORS[2]
      },
      yAxisIndex: 1,
      data: totalPage
    }
    const seriesConfig = template !== 'zj' ? [returnAmountSeries, totalAmountSeries, totalPageSeries] : [totalAmountSeries, returnAmountSeries, totalPageSeries]

    myChart.setOption({
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
          let returnAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[1]}"></span> ${legendTxt[1]}</p> <p style="font-weight: bold;">${returnAmount[dataIndex]}卷</p></div>`
          let totalPageStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[2]}"></span> ${legendTxt[2]}</p> <p style="font-weight: bold;">${totalPage[dataIndex]}页</p></div>`
          let returnRateStr = ''
          if (template !== 'zj') {
            returnRateStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${COLORS[1]};"></span> 被退回率</p> <p style="font-weight: bold;">${returnRate[dataIndex]}%</p></div>`
          }
          
          return template === 'zj' ? (relVal + totalAmountStr + returnAmountStr + totalPageStr) : (
            relVal + totalAmountStr + returnAmountStr + returnRateStr + totalPageStr
          )
        }
      },
      legend: {
        data: legendTxt,
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
      yAxis: [
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
          splitLine: {
            show: false
          },
          position: 'bottom'
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
          splitLine: {
            show: false
          },
          position: 'top'
        }
      ],
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
      series: seriesConfig
    })
  }

  render() {
    return (
      <div>
        <div id="tplTaskChart" style={{height: '760px',width: '100%',backgroundColor: '#fff', display: this.state.totalAmount.length ? 'block' : 'none'}}></div>
        {
          this.state.totalAmount.length ? <div></div> : <Empty style={{marginTop: '250px'}} description={'暂无数据'} />
        }
      </div>
    )
  }
}