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

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}

const colors = ['#80b3ff', '#FF8A80', '#ffb84d', '#FFAB91'];

export default class PersonCompareChartCanvas extends Component {
  constructor(props) {
    super(props);
    
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let personListChart = chartData.personListChart
    let chartDataType = props.chartDataType

    let formatPersonList = []

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
    })
    
    this.state = {
      templateTxt: template[props.template] || '',
      legendTxt: [`${props.template === 'zj' ? '发现合格卷数' : '总卷数'}`, `${props.template === 'zj' ? '发现不合格卷数' : '被退回卷数'}`, '总页数'],
      template: props.template,
      datesRangeTxt: props.datesRangeTxt || '',
      datesRange: props.datesRange,
      totalAmount,
      returnAmount,
      totalPage,
      yAxisTxt
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps)
    
    
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let personListChart = chartData.personListChart
    let chartDataType = nextProps.chartDataType
    let formatPersonList = []

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
    })

    this.setState({
      templateTxt: template[nextProps.template] || '',
      template: nextProps.template,
      legendTxt: [`${nextProps.template === 'zj' ? '发现合格卷数' : '总卷数'}`, `${nextProps.template === 'zj' ? '发现不合格卷数' : '被退回卷数'}`, '总页数'],
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
    console.log('componentDidMount')
    setTimeout(() => {
      this.getOption()
    })
  }

  getOption = () => {
    var myChart = echarts.init(document.getElementById('PersonCompareChartCanvas'));

    myChart.resize()
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

    const totalAmountSeries = {
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
        color: colors[0]
      },
      data: this.state.totalAmount,
      markLine: {
        show: false,
        lineStyle: {
          opacity: 0,
          color: '#f00'
        }
      }
    }
    const returnAmountSeries = {
      name: this.state.legendTxt[1],
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
        color: this.state.template === 'zj' ? colors[3] : colors[1]
      },
      yAxisIndex: 0,
      data: this.state.returnAmount,
      markLine: {
        data: this.state.template === 'zj' ? [] : [{ type: 'average', name: '退回卷数平均值' }],
        lineStyle: this.state.template === 'zj' ? {
          normal: {
            opacity: 0
          }
        } : {
          normal: {
            opacity: 1,
            color: colors[1]
          }
        },
        label: {
          show: this.state.template !== 'zj',
          color: colors[1],
          formatter: param => {
            if (this.state.template === 'zj') {
              return ''
            } else {
              return `退回卷数平均值 ${Math.floor(param.value)} 卷`
            }
          }
        }
      }
    }
    const totalPageSeries = {
      name: '总页数',
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
          return params.value + `页 \n\n (${this.state.totalAmount[dataIndex]}卷)`
        },
      },
      itemStyle: {
        color: colors[2]
      },
      yAxisIndex: 1,
      interval: 8,
      data: this.state.totalPage,
      markPoint: {
        data: [
          {
            value: '',
            symbol: "image://" + require('./images/1.png'),
            symbolSize: 55,
            symbolRotate: -30,
            coord: [0, this.state.totalPage[0] + (this.state.totalPage[0] * 0.05)]
          },
          {
            value: '',
            symbol: "image://" + require('./images/2.png'),
            symbolSize: 50,
            symbolRotate: -30,
            coord: [1, this.state.totalPage[1] + (this.state.totalPage[0] * 0.045)]
          },
          {
            value: '',
            symbol: "image://" + require('./images/3.png'),
            symbolSize: 45,
            symbolRotate: -30,
            coord: [2, this.state.totalPage[2] + (this.state.totalPage[0] * 0.04)]
          }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: '工作量平均值' }],
        label: {
          show: true,
          color: colors[2],
          formatter: param => {
            return `工作量平均值 ${Math.floor(param.value)} 页`
          }
        }
      }
    }
    
    const seriesConfig = this.state.template === 'zj' ? 
    [totalAmountSeries, returnAmountSeries, totalPageSeries] : [returnAmountSeries, totalAmountSeries, totalPageSeries]

    myChart.setOption({
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: data => {
          let relVal = `<p style="margin: 0;padding: 0;font-size: 16px;">${data[0].name}</p>`
          let dataIndex = data[0].dataIndex
          
          let totalAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#80b3ff;"></span> ${this.state.legendTxt[0]}</p> <p style="font-weight: bold;">${this.state.totalAmount[dataIndex]}卷</p></div>`
          let returnAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#FF8A80;"></span> ${this.state.legendTxt[1]}</p> <p style="font-weight: bold;">${this.state.returnAmount[dataIndex]}卷</p></div>`
          let totalPageStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ffb84d;"></span> 总页数</p> <p style="font-weight: bold;">${this.state.totalPage[dataIndex]}页</p></div>`
          return relVal + totalAmountStr + returnAmountStr + totalPageStr
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
              color: colors[2]
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
        <div id="PersonCompareChartCanvas" style={{height: '760px',width: '100%',backgroundColor: '#fff', display: this.state.totalAmount.length ? 'block' : 'none'}}></div>
        {
          this.state.totalAmount.length ? <div></div> : <Empty style={{marginTop: '250px'}} description={'暂无数据'} />
        }
      </div>
    )
  }
}