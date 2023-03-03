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

      // console.log('personName', personName)

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
        data: ['总页数', '被退回卷数'],
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
          name: '',
          alignTicks: true,
          axisTick: {
            show: true,
            alignWithLabel: true,
            inside: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            } 
          },
          axisLabel: {
            formatter: '{value}'
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
          }
        }
      ],
      series: [
        {
          name: '被退回卷数',
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
          yAxisIndex: 0,
          data: this.state.returnAmount
        },
        {
          name: '总页数',
          type: 'bar',
          stack: 'scan',
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
          yAxisIndex: 0,
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
          }
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