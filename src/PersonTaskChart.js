import React, {
  Component
} from 'react'
import * as echarts from 'echarts'

const template = {
  'pb': '平板扫描',
  'pt': '影像处理',
  'zj': '质检管理',
}



export default class PersonTaskChart extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      templateTxt: template[props.template] || '',
      person: props.person,
      datesRangeTxt: props.datesRangeTxt || ''
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps)
    this.setState({
      templateTxt: template[nextProps.template] || '',
      person: nextProps.person,
      datesRangeTxt: nextProps.datesRangeTxt || '' 
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
    var myChart = echarts.init(document.getElementById('personTaskChart'));

    // const colors = ['#5470C6', '#91CC75', '#EE6666'];
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
        data: ['总卷数', '被退回次数/卷数', '总页数'],
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
          top: '50',
          width: '65%',
          bottom: 80,
          left: 10,
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
      xAxis: [
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
        // {
        //   type: 'value',
        //   name: '被退回次数/卷数',
        //   alignTicks: true,
        //   axisLine: {
        //     show: true,
        //     lineStyle: {
        //       color: colors[2]
        //     }
        //   },
        //   axisLabel: {
        //     formatter: '{value} 次/卷'
        //   },
        //   position: 'bottom',
        //   offset: 40
        // },
      ],
      yAxis: [
        {
          type: 'category',
          // axisTick: {
          //   alignWithLabel: true
          // },
          // prettier-ignore
          data: ['1日','2日','3日','4日','5日','6日','7日',
          '8日','9日','10日','11日','12日','13日','14日',
          '15日','16日','17日','18日','19日','20日','21日',
          '22日','23日','24日','25日','26日','27日','28日','29日','30日'
          ],
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
          data: [12,10,9,5,13,12,14,10,9,5,13,12,14,10,9,5,13,12,14,10,9,5,13,12,14,10,9,5,13,12],
          // itemStyle: {
          //   normal: {
          //     color: colors[0]
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
            }
          },
          // xAxisIndex: 2,
          data: [60,50,65,32,40,25, 10,60,50,65,32,40,25, 
          10,60,50,65,32,40,25, 10,60,50,65,32,40,25, 10,22,56]
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
          xAxisIndex: 1,
          data: [4562,5684,5264,2356,1248,1652,1548,5684,5264,2356,
          1248,1652,1548,5684,5264,2356,1248,1652,1548,5684,5264,
          2356,1248,1652,1548,5264,2356,1248,1652,1548]
        },
        {
          name: '总卷数占比',
          type: 'pie',
          radius: '80',
          data: [
            { value: 1206, name: `${this.state.person}合格页数(10%)`, itemStyle: {color: '#Fccf5f'} },
            { value: 43545, name: '小组合格页数(43545)', itemStyle: {color: '#1cb7b7'} }
          ],
          left: '65%',
          top: '-50%'
        },
        {
          name: '总卷数占比',
          type: 'pie',
          radius: '80',
          data: [
            { value: 106, name: `${this.state.person}退回卷数(20%)`, itemStyle: {color: '#CB8087'} },
            { value: 1545, name: '小组退回卷数(1545)', itemStyle: {color: '#A4DAD5'}}
          ],
          left: '65%',
          top: '20%'
        },
      ]
    })
  }

  render() {
    return (<div id="personTaskChart" style ={{height: '760px',width: '100%',backgroundColor: '#fff'}}></div>)
  }
}