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

export default class PersonCompareChartCanvas extends Component {
  constructor(props) {
    super(props);

    console.log('props in PersonCompareChartCanvas', props)
    
    let totalAmount = []
    let returnAmount = []
    let totalPage = []
    let yAxisTxt = []
    let personListChart = chartData.personListChart
    // let template = props.template
    let chartDataType = props.chartDataType

    // personListChart.map(personObj => {
    //   let personName = Object.keys(personObj)[0]
    //   if (personObj[personName] && personObj[personName][props.template] && personObj[personName][props.template][chartDataType]) {
    //     let data = personObj[personName][props.template][chartDataType]
    //     yAxisTxt.push(personName)
    //     totalAmount.push(data.totalAmount)
    //     returnAmount.push(data.returnAmount)
    //     totalPage.push(data.totalPage)
    //   }
    // })

    let formatPersonList = []

    personListChart.map(obj => {
      let personName = Object.keys(obj)[0]

      let personData = {}

      console.log('personName', personName)

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

    console.log(formatPersonList)
    formatPersonList.map(v => {
      
      yAxisTxt.push(v.name)
      totalAmount.push(v.totalAmount)
      returnAmount.push(v.returnAmount)
      totalPage.push(v.totalPage)
    })
    
    this.state = {
      templateTxt: template[props.template] || '',
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

    // personListChart.map(personObj => {
    //   let personName = Object.keys(personObj)[0]
    //   if (personObj[personName] && personObj[personName][nextProps.template] && personObj[personName][nextProps.template][chartDataType]) {
    //     let data = personObj[personName][nextProps.template][chartDataType]
    //     yAxisTxt.push(personName)
    //     totalAmount.push(data.totalAmount)
    //     returnAmount.push(data.returnAmount)
    //     totalPage.push(data.totalPage)
    //   }
    // })

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
        }
      },
      legend: {
        data: ['总卷数', '被退回次数/卷数', '总页数'],
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
          top: '50',
          width: '85%',
          // bottom: 80,
          left: 10,
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
          position: 'right'
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
          position: 'left'
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
          },
          inverse: true
        }
      ],
      series: [
        {
          name: '被退回次数/卷数',
          type: 'bar',
          stack: 'scan',
          label: {
            show: true,
            position: 'insideRight',
            textStyle: {
              color: '#424242'
            }
          },
          // xAxisIndex: 2,
          data: this.state.returnAmount
        },
        {
          name: '总卷数',
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
          data: this.state.totalAmount
        },
        {
          name: '总页数',
          type: 'line',
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
      ]
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