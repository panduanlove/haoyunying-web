import https from 'https';
import { hospitalKey } from './interface/IHospital';
import createBeijingxieheyiyuan from './crawler/beijingxieheyiyuan';
import createZhongriyouhaoyiyuan from './crawler/zhongriyouhaoyiyuan';

export function request (url:string) {
  return new Promise(function (resolve) {
    https.get(url, function (res) {
      // 分段返回的 自己拼接
      let data = '';
      // 有数据产生的时候 拼接
      res.on('data', function (chunk) {
        data += chunk;
      });
      // 拼接完成
      res.on('end', function () {
        resolve(data);
      });
    });
  });
}

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

const createrMap = {
  beijingxieheyiyuan: createBeijingxieheyiyuan,
  zhongriyouhaoyiyuan: createZhongriyouhaoyiyuan
}

// 生成各医院表格的工厂方法
export function creater (hospitalKey: hospitalKey) {
  return createrMap[hospitalKey];
}
