/**
 * 获取两个日期之间日期列表函数
 * 返回两个时间之间所有的日期
 * @param {'2021-05-31'} start 
 * @param {'2021-06-30'} end 
 */
export const getTimeTwo = (start, end) => {
  let diffdate = new Array();
  let arr = []
  let i = 0
  // 开始日期小于等于结束日期，并循环
  while (start <= end) {
    diffdate[i] = start;
    // 获取开始日期时间戳
    let stime_ts = new Date(start).getTime()
    // 增加一天时间戳后的日期
    let next_date = stime_ts + (24*60*60*1000)
    // 拼接年月日，这里的月份会返回0-11，所以要+1
    let next_dates_y = new Date(next_date).getFullYear() + '-';
    let next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
    let next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();
    start = next_dates_y + next_dates_m + next_dates_d;
    // 增加数组key
    i++;
  }
  return diffdate;
}

/**
 * 获取两个日期中所有的月份
 * 返回两个时间之间的所有的月份
 * @param {'2021-01-01'} start 
 * @param {'2021-06-01'} end 
 * @returns 
 */
export const getMonthBetween = (start, end) => {
  let result = []
  let min = new Date(start)
  let max = new Date(end)
  let curr = min
  do{
    let month = new Date(curr).getMonth() + 1
    let t = ''
    if (month < 10) {
      t = '0' + month
    } else t = month
    let str = curr.getFullYear() + '-' + (t)
    result.push(str)
    if (month == 12) {
      curr.setFullYear(new Date(curr).getFullYear() + 1)
      curr.setMonth(0)
    } else curr.setMonth(month)
  } while (curr <= max)

  return result
}

/**
 * 获取两个日期中所有的年份
 * 返回两个时间之间所有的年份
 * @param {'2016-01-01'} start 
 * @param {'2021-01-01'} end 
 * @returns 
 */
export const getYearBetween = (start, end) => {
  let result = []
  let min = new Date(start).getFullYear()
  let max = new Date(end).getFullYear()
  while (min <= max) {
    result.push(min)
    min = (Number(min) + 1)
  }
  return result;
}