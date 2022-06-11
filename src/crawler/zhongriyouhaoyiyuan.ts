/**
 * 中日友好医院医生出诊时间表
 */
import { request, formatDate } from '../util';
import { EHospitalName } from '../enum/EHospital'
import { createWorksheet, setRow } from '../worksheet';
import IWooksheetDic from '../interface/IWooksheetDIc';

const periodDic: {[key: string]: string} = {
  1: '上午',
  2: '下午'
};

const hospitalPlaceUrl = 'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist';
const clinicUrl = 'https://www.zryhyy.com.cn/schedul_interface/scheduling/schedulDataByHosCode';

const worksheetDic: IWooksheetDic = {
  '001': '本部',
  '003': '北区',
  '002': '西区',
  '004': '国际部'
};

// 导出脚本创建器方法
export default function creater () {
  return createWorksheet(worksheetDic, getData, EHospitalName.中日友好医院);
}

// 处理html，返回生成表格需要的数据
async function getData (hosCode:string, worksheet:any) {
  const result = [
    ['科室', '时间', '日期', '医生', '是否停诊']
  ];
  const promises = [];
  const { data } = await request(`${hospitalPlaceUrl}?hosCode=${hosCode}`);
  // 获取科室列表
  const { data: facultyList } = data;
  for (const faculty of facultyList) {
    promises.push(
      request(`${clinicUrl}?hosCode=${faculty.hospitalcode}&depCode=${faculty.code1}`)
    );
  }
  const datas = await Promise.all(promises);
  for (const response of datas) {
    const { data: { data: menzhenInfo } } = response;
    for (const facultyName in menzhenInfo) {
      const detail = menzhenInfo[facultyName];
      for (const period in detail) {
        const dateInfo = detail[period];
        for (const date in dateInfo) {
          for (const doctor of dateInfo[date]) {
            const standardDate = formatDate(new Date(date), 'yyyy-MM-dd');
            result.push([doctor.deptname, periodDic[period], standardDate, doctor.doctname, doctor.validflag === 1 ? '' : '停诊']);
          }
        }
      }
    }
  }
  worksheet.addRows(result);
  setColumn(worksheet);
  setRow(worksheet);
  return result;
}

// 设置列
export function setColumn (worksheet:any) {
  // 设置列
  worksheet.columns = [
    { key: 'facultyName', width: 40 },
    { key: 'period', width: 15 },
    { key: 'date', width: 40 },
    { key: 'doctor', width: 40 },
    { key: 'validflag', width: 40 }
  ];
}
