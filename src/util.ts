/**
 * 判断两个日期是否是同一天
 * @param dateA
 * @param dateB
 * @returns boolean
 */
export function isSameDay (dateA: Date, dateB: Date) {
  const { getFullYear, getMonth, getDate } = Date.prototype
  return [getFullYear, getMonth, getDate].every(fn => {
    return fn.call(dateA) === fn.call(dateB)
  })
}

export function formatDate (date:any, fmt:any) {
  if (date && !date.length) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    const o:any = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
      }
    }
    return fmt
  } else {
    return date;
  }
}

function padLeftZero (str:string) {
  return ('00' + str).substr(str.length)
}
