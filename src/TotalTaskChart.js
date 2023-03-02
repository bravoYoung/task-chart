import React, {
  Component
} from 'react'
import * as echarts from 'echarts'
import chartData from './data'

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}



export default class TotalTaskChart extends Component {
  constructor(props) {
    super(props);



    console.log('props in TotalTaskChart', props)
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
    console.log('componentWillReceiveProps in TotalTaskChart', nextProps)
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
    console.log('componentDidMount')
    // this.setState({
    //   templateTxt: template[this.props.template] || ''
    // })
    setTimeout(() => {
      this.getOption()
    })
  }

  getOption = () => {
    
    var myChart = echarts.init(document.getElementById('totalTaskChart'));

    // const colors = ['#5470C6', '#91CC75', '#EE6666'];
    const colors = ['#FF8A80', '#80b3ff', '#ffb84d'];

    myChart.setOption({
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        right: '20%',
        top: '10%'
      },
      toolbox: {
        // feature: {
        //   dataView: { show: true, readOnly: false },
        //   restore: { show: true },
        //   saveAsImage: { show: true }
        // }
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
        data: ['总卷数', '被退回次数/卷数', '总页数'],
        bottom: 10
      },
      yAxis: [
        {
          type: 'category',
          // axisTick: {
          //   alignWithLabel: true
          // },
          // prettier-ignore
          data: ['人员建库', '目录著录', '平版扫描', '影像处理', '质检管理'],
          axisLabel: {
            interval: 0,
            rotate: 30,
            textStyle: {
              fontSize: 14
            }
          }
        }
      ],
      xAxis: [
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
          name: '被退回次数/卷数',
          type: 'bar',
          barWidth: '50',
          stack: 'scan',
          label: {
            show: true,
            position: 'insideRight',
            textStyle: {
              color: '#424242'
            }
          },
          xAxisIndex: 0,
          data: this.state.returnAmount,
          // itemStyle: {
          //   normal: {
          //     color: '#EA6868'
          //   }
          // }
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
            },
            formatter: (params) => {
              switch(params.dataIndex) {
                case 0: return params.value;
                case 1: return params.value;
                case 2: return params.value + `（${this.state.totalPage[2]}页）`;
                case 3: return params.value + `（${this.state.totalPage[3]}页）`;
                case 4: return params.value + `（${this.state.totalPage[4]}页）`;
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