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

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}
const colors = ['#80b3ff', '#FF8A80', '#ffb84d', '#FFAB91'];

export default class TplTaskChart extends Component {
  constructor(props) {
    super(props);

    console.log('props in TplTaskChart', props)
    
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let data = chartData.tplChart[props.template]

    if(props.datesRange && props.datesRange.length) {
      props.datesRange.map(d => {
        if(data[d] && data[d].totalAmount) {
          yAxisTxt.push(d)
          totalAmount.push(data[d].totalAmount)
          returnAmount.push(data[d].returnAmount)
          totalPage.push(data[d].totalPage)
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
      yAxisTxt
    };
  }

  componentWillReceiveProps(nextProps) {
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let data = chartData.tplChart[nextProps.template]

    if(nextProps.datesRange && nextProps.datesRange.length) {
      nextProps.datesRange.map(d => {
        if(data[d] && data[d].totalAmount) {
          yAxisTxt.push(d)
          totalAmount.push(data[d].totalAmount)
          returnAmount.push(data[d].returnAmount)
          totalPage.push(data[d].totalPage)
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
      template
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
        color: colors[0]
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
        color: template === 'zj' ? colors[3] : colors[1]
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
        color: colors[2]
      },
      yAxisIndex: 1,
      data: totalPage
    }
    const seriesConfig = template !== 'zj' ? [returnAmountSeries, totalAmountSeries, totalPageSeries] : [totalAmountSeries, returnAmountSeries, totalPageSeries]

    myChart.setOption({
      // backgroundColor: {
      //   type: 'pattern',
      //   image: canvas,
      //   repeat: 'repeat'
      // },
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: data => {
          let relVal = `<p style="margin: 0;padding: 0;font-size: 16px;">${data[0].name}</p>`
          let dataIndex = data[0].dataIndex
          
          let totalAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#80b3ff;"></span> 总卷数</p> <p style="font-weight: bold;">${this.state.totalAmount[dataIndex]}卷</p></div>`
          let returnAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#FF8A80;"></span> 被退回卷数</p> <p style="font-weight: bold;">${this.state.returnAmount[dataIndex]}卷</p></div>`
          let totalPageStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ffb84d;"></span> 总页数</p> <p style="font-weight: bold;">${this.state.totalPage[dataIndex]}页</p></div>`
          return relVal + totalAmountStr + returnAmountStr + totalPageStr
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
              color: colors[0]
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
              color: colors[2]
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