import React from 'react';
import './index.css';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import {
  DatePicker, 
  Select, 
  Space,
  TimePicker,
  Layout,
  Button,
  Upload,
  Popconfirm,
  Tabs,
  Input,
  Image,
  Row,
  Col,
  Radio,
  Switch,
  AutoComplete,
	Empty,
	ConfigProvider
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TotalTaskChart from './TotalTaskChart.js'
import TplTaskChart from './TplTaskChart.js'
import PersonTaskChart from './PersonTaskChart.js'
import {
	getTimeTwo,
	getMonthBetween,
	getYearBetween
} from './getDates'
import chartData from './data'
import personCompareChart from './PersonCompareChart'
import PersonCompareChart from './PersonCompareChart';
const { RangePicker } = DatePicker;
const { Option } = Select;
const {
  Header,
  Content,
  Sider,
  Footer
} = Layout


export default class Demo extends React.Component {
	constructor(props) {
		super(props);

		let { personNameList } = chartData
		let personList = []
		if(personNameList && personNameList.length) {
			personNameList.map(v => {
				let obj = {value: v}
				personList.push(obj)
			})
		}


		this.state = {
			activeTab: "1",
			pickerRangeType: 'date',
			dates: [dayjs('2023-01-01', 'YYYY-MM-DD'), dayjs('2023-01-31', 'YYYY-MM-DD')],
			datesValue: [dayjs('2023-01-01', 'YYYY-MM-DD'), dayjs('2023-01-31', 'YYYY-MM-DD')],
			template: 'pb',
			isShowTotal: false,
			person: '',
			datesRange: getTimeTwo('2023-01-01', '2023-01-31'),
			datesRangeTxt: `2023-01-01 至 2023-01-31`,
			chartDataType: '31days',
			isHiddenChart: false,
			personList
		};
	}


	componentDidMount () {
		// console.log('datesRange', this.state.datesRange)
	}

	handlePersonChange = (person) => {
		if (person && person.length) {
			this.setState({person})
		} else {
			this.setState({
				person: ''
			})
		}
	}

	render () {
		const items = [
			{
			  key: '1',
			  label: `表格视图`
			},
			{
			  key: '2',
			  label: `模块对比`
			},
			{
			  key: '3',
			  label: `人员对比`
			}
		];

		const disabledDate = (current) => {
			if (!this.state.dates) {
			  return false;
			}
			const tooLate = this.state.dates[0] && current.diff(this.state.dates[0], 'days') > 30;
			const tooEarly = this.state.dates[1] && this.state.dates[1].diff(current, 'days') > 30;
			return !!tooEarly || !!tooLate;
		};
		const onOpenChange = (open) => {
			if (open) {
			  this.setState({
				  date: [null, null]
			  });
			} else {
				this.setState({
					date: null
				});
			}
		};
		const PickerWithType = ({ pickerRangeType, value, onChange }) => {
			return <RangePicker picker={pickerRangeType} onChange={onChange} value={value} locale={locale} />;
		};

		return (
			<Layout style={{background: '#fff'}}>
				<Space>
					<Tabs
						defaultActiveKey={this.state.activeTab}
						type="card"
						items={items}
						onChange={(activeKey) => {
							this.setState({activeTab: activeKey})
						}}
					/>
				</Space>

				{/* tab1 */}
				<div style={{display: this.state.activeTab === '1' ? 'block' : 'none'}}>
					{/* <div className="mb-10 red f16">保持原来的设计</div> */}
					<div className="">
						<img src={require('./images/workchart.png')} width="90%" style={{margin: '0 auto', display: 'block'}} />
					</div>
				</div>

				{/* tab3 */}
				<div style={{display: this.state.activeTab === '2' ? 'block' : 'none'}}>
					<Row>
						<Col span={20}>
							<Space>

								<Space>

									<Select value={this.state.pickerRangeType} onChange={(pickerRangeType) => {
										this.setState({
											pickerRangeType,
											isHiddenChart: true,
											dates: [],
											datesValue: [],
											datesRange: [],
											datesRangeTxt: ``
										})
									}}>
										<Option value="date">日期</Option>
										<Option value="month">月份</Option>
										<Option value="year">年份</Option>
									</Select>

									{
										this.state.pickerRangeType === 'date' ? (
											<Space>
												<ConfigProvider locale={locale}>
													<RangePicker
														value={this.state.datesValue || this.state.dates}
														disabledDate={disabledDate}
														onCalendarChange={(val) => this.setState({dates: val})}
														onChange={(val) => {
															let datesRange = []
															let chartDataType = '31days'
															if (val && val.length) {
																val.map(v => {
																	datesRange.push(dayjs(v.$d).format('YYYY-MM-DD'))
																})
																let everyDates = getTimeTwo(...datesRange)
																if (everyDates.length === 1) {
																	chartDataType = '1day'
																} else if (everyDates.length === 31) {
																	chartDataType = '31days'
																} else {
																	chartDataType = '31days'
																}
																this.setState({
																	isHiddenChart: false,
																	dates: val,
																	datesValue: val,
																	datesRange: everyDates,
																	datesRangeTxt: `${datesRange[0]} 至 ${datesRange[1]}`,
																	chartDataType
																})
															} else {
																this.setState({
																	dates: [],
																	datesValue: [],
																	datesRange: [],
																	datesRangeTxt: ``,
																	isHiddenChart: true,
																	chartDataType
																})
															}
														}}
														onOpenChange={onOpenChange}
													/>
												</ConfigProvider>
												
											</Space>
										) : (
											<Space>
												<ConfigProvider locale={locale}>
													<PickerWithType pickerRangeType={this.state.pickerRangeType} locale={locale} value={this.state.dates} onChange={(val) => {
														let datesRange = []
														let formatTxt = ''
														if (this.state.pickerRangeType === 'month') {
															formatTxt = 'YYYY-MM'
														}
														if (this.state.pickerRangeType === 'year') {
															formatTxt = 'YYYY'
														}
														if (val && val.length) {
															val.map(v => {
																datesRange.push(dayjs(v.$d).format(formatTxt))
															})

															if (this.state.pickerRangeType === 'month') {
																let everyDates = getMonthBetween(...datesRange)
																this.setState({
																	isHiddenChart: false,
																	dates: val,
																	datesRange: everyDates,
																	datesRangeTxt: `${datesRange[0]} 至 ${datesRange[1]}`,
																	chartDataType: '6months'
																})
															}
															if (this.state.pickerRangeType === 'year') {
																this.setState({
																	isHiddenChart: false,
																	dates: val,
																	datesRange: getYearBetween(...datesRange),
																	datesRangeTxt: `${datesRange[0]} 至 ${datesRange[1]}`,
																	chartDataType: '1year'
																})
															}
														} else {
															this.setState({
																dates: [],
																datesValue: [],
																datesRange: [],
																datesRangeTxt: ``,
																isHiddenChart: true,
																chartDataType: '31days'
															})
														}
														
													}} />
												</ConfigProvider>
											</Space>
										)
									}
									
								</Space>
							  

								<Space>
									是否预览全模块工作量：
									<Switch
										checked={this.state.isShowTotal}
										checkedChildren="开启"
										unCheckedChildren="关闭"
										onChange={e => {
											this.setState({
												isShowTotal: !this.state.isShowTotal
											})
										}}
									/>
								</Space>

								<span style={{display: this.state.isShowTotal ? 'none': 'inline-block'}} >
									<Space>
										<Radio.Group
											value={this.state.template}
											onChange={(e) => {
											  this.setState({
											  	template: e.target.value
											  })
											}}
										>
											<Radio.Button value="pb">平板扫描</Radio.Button>
											<Radio.Button value="pt">影像处理</Radio.Button>
											<Radio.Button value="zj">质检管理</Radio.Button>
										</Radio.Group>
									</Space>
									<Space className="ml-20"> 查询人员：
									  <AutoComplete
							        placeholder="输入姓名"
							        options={this.state.personList}
							        style={{width: '140px'}}
							        filterOption={(inputValue, option) =>
									      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
									    }
									    onChange={this.handlePersonChange}
							      />
									</Space>
								</span>

							</Space>

						</Col>
						<Col span={4}>
							<Space>
								<Button>查询</Button>
								<Button>重置</Button>
								<Button>导出为PDF</Button>
							</Space>
						</Col>
					</Row>

					<Row style={{marginTop: '30px'}}>
						{
							this.state.isHiddenChart ? (<Col flex="auto">
									<Empty style={{marginTop: '250px'}} description={false} />
								</Col>) : (
								<Col style={{height: '700px', width: '100%'}}>
									{
										this.state.isShowTotal ? 
										<TotalTaskChart template={this.state.template} datesRange={this.state.datesRange} datesRangeTxt={this.state.datesRangeTxt} chartDataType={this.state.chartDataType} />
										: (this.state.person==='' ? 
											<TplTaskChart template={this.state.template} datesRange={this.state.datesRange} datesRangeTxt={this.state.datesRangeTxt} chartDataType={this.state.chartDataType} />
											: <PersonTaskChart template={this.state.template} person={this.state.person} datesRange={this.state.datesRange} datesRangeTxt={this.state.datesRangeTxt} chartDataType={this.state.chartDataType} />
											)
									}
								</Col>
							) 
						}
					</Row>
				</div>

				<div style={{display: this.state.activeTab === '3' ? 'block' : 'none'}}>
					<PersonCompareChart />
				</div>
			</Layout>
		)
	}
}

