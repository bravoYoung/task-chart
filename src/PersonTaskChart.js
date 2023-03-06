import React, {
  Component
} from 'react'
import * as echarts from 'echarts'
import chartData from './data'
import {
  Empty
} from 'antd'

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}

const sum = arr => {
  return eval(arr.join('+'))
}

export default class PersonTaskChart extends Component {
  constructor(props) {
    super(props);

    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let data = {}
    if (chartData.personChart && chartData.personChart[props.person] && chartData.personChart[props.person][props.template]) {
      data = chartData.personChart[props.person][props.template]
    }
    let totalData = {}
    if (props.chartDataType && chartData.totalData && chartData.totalData[props.chartDataType] && chartData.totalData[props.chartDataType][props.template]) {
      totalData = chartData.totalData[props.chartDataType][props.template]
    }
    let personTotalPageRate = 0
    let personReturnAmountRate = 0

    if(props.datesRange && props.datesRange.length) {
      props.datesRange.map(d => {
        if(data[d] && data[d].totalAmount) {
          yAxisTxt.push(d)
          totalAmount.push(data[d].totalAmount)
          returnAmount.push(data[d].returnAmount)
          totalPage.push(data[d].totalPage)
        }
      })

      if (totalData.returnAmount) {
        personReturnAmountRate = (totalData.returnAmount / sum(returnAmount)).toFixed(2)
      }
      if (totalData.totalPage) {
        personTotalPageRate = (totalData.totalPage / sum(totalPage)).toFixed(2)
      }
    }
    
    this.state = {
      templateTxt: template[props.template] || '',
      person: props.person,
      datesRangeTxt: props.datesRangeTxt || '',
      chartDataType: props.chartDataType,
      totalAmount,
      returnAmount,
      totalPage,
      yAxisTxt,
      totalData,
      personReturnAmountRate,
      personTotalPageRate
    };
  }

  componentWillReceiveProps(nextProps) {
    
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let data = {}
    if (chartData.personChart && chartData.personChart[nextProps.person] && chartData.personChart[nextProps.person][nextProps.template]) {
      data = chartData.personChart[nextProps.person][nextProps.template]
    }
    let totalData = {}
    if (nextProps.chartDataType && chartData.totalData && chartData.totalData[nextProps.chartDataType] && chartData.totalData[nextProps.chartDataType][nextProps.template]) {
      totalData = chartData.totalData[nextProps.chartDataType][nextProps.template]
    }
    let personTotalPageRate = 0
    let personReturnAmountRate = 0


    if(nextProps.datesRange && nextProps.datesRange.length) {
      nextProps.datesRange.map(d => {
        if(data[d] && data[d].totalAmount) {
          yAxisTxt.push(d)
          totalAmount.push(data[d].totalAmount)
          returnAmount.push(data[d].returnAmount)
          totalPage.push(data[d].totalPage)
        }
      })

      if (totalData.returnAmount) {
        personReturnAmountRate = (sum(returnAmount) / totalData.returnAmount).toFixed(2)
      }
      if (totalData.totalPage) {
        personTotalPageRate = (sum(totalPage) / totalData.totalPage).toFixed(2)
      }
    }

    this.setState({
      templateTxt: template[nextProps.template] || '',
      person: nextProps.person,
      datesRangeTxt: nextProps.datesRangeTxt || '',
      chartDataType: nextProps.chartDataType,
      totalAmount,
      returnAmount,
      totalPage,
      yAxisTxt,
      totalData,
      personReturnAmountRate,
      personTotalPageRate
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
    var myChart = echarts.init(document.getElementById('personTaskChart'));

    myChart.resize()
    const colors = ['#FF8A80', '#80b3ff', '#ffb84d'];
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
          
          let totalAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#80b3ff;"></span> 总卷数</p> <p style="font-weight: bold;">${this.state.totalAmount[dataIndex]}卷</p></div>`
          let returnAmountStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#FF8A80;"></span> 被退回卷数</p> <p style="font-weight: bold;">${this.state.returnAmount[dataIndex]}卷</p></div>`
          let totalPageStr = `<div  style="display: flex;justify-content: space-between;align: center;height: 30px;"><p style="margin-right: 30px;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#ffb84d;"></span> 总页数</p> <p style="font-weight: bold;">${this.state.totalPage[dataIndex]}页</p></div>`
          return relVal + totalAmountStr + returnAmountStr + totalPageStr
        }
      },
      toolbox: {
        // feature: {
        //   dataView: { show: true, readOnly: false },
        //   restore: { show: true },
        //   saveAsImage: { show: true }
        // }
      },
      legend: {
        data: ['总卷数', '被退回卷数', '总页数'],
        bottom: 10
      },
      title: [
        {
          text: `${this.state.templateTxt}工作量统计 - ${this.state.person}`,
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
          width: '65%',
          bottom: 80,
          left: 80,
          containLabel: true
        },
        {
          // top: '55%',
          width: '35%',
          // bottom: 80,
          // left: 10,
          containLabel: true
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '总卷数',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel: {
            formatter: '{value} 卷'
          },
          // position: 'top'
        },
        {
          type: 'value',
          name: '总页数',
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
          // position: 'bottom'
        },
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
      series: [
        {
          name: '被退回卷数',
          type: 'bar',
          stack: 'scan',
          label: {
            show: true,
            position: 'insideRight',
            textStyle: {
              color: '#424242'
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
            position: 'insideRight',
            textStyle: {
              color: '#424242'
            }
          },
          // xAxisIndex: 2,
          data: this.state.totalAmount
        },
        {
          name: '总页数',
          type: 'line',
          // stack: 'scan',
          label: {
            show: true,
            position: 'insideRight',
            textStyle: {
              color: '#424242'
            }
          },
          yAxisIndex: 1,
          data: this.state.totalPage
        },
        {
          name: '总页数占比',
          type: 'pie',
          radius: '80',
          data: [
            { value: 1206, name: `${this.state.person}合格页数(${sum(this.state.totalPage)}, ${this.state.personTotalPageRate}%)`, itemStyle: {color: '#B995C3'} },
            { value: 43545, name: `小组合格页数(${this.state.totalData.totalPage})`, itemStyle: {color: '#C3BEDE'} }
          ],
          left: '65%',
          top: '-50%'
        },
        {
          name: '退回卷数占比',
          type: 'pie',
          radius: '80',
          data: [
            { value: 106, name: `${this.state.person}退回卷数(${sum(this.state.returnAmount)}, ${this.state.personReturnAmountRate}%)`, itemStyle: {color: '#88ADDA'} },
            { value: 1545, name: `小组退回卷数(${this.state.totalData.returnAmount})`, itemStyle: {color: '#8DCCDD'}}
          ],
          left: '65%',
          top: '20%'
        },
      ]
    })
  }

  render() {
    return (
      <div>
        <div id="personTaskChart" style={{height: '760px',width: '100%',backgroundColor: '#fff', display: this.state.totalAmount.length ? 'block' : 'none'}}></div>
        {
          this.state.totalAmount.length ? <div></div> : <Empty style={{marginTop: '250px'}} description={'暂无数据'} />
        }
      </div>
    )
  }
}