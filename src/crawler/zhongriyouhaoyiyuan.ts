/**
 * 中日友好医院医生出诊时间表
 */
import { request } from '../util';
import { EHospitalName } from '../enum/EHospital'
import { createWorksheet, setColumn, setRow } from '../worksheet';

const periodDic:any = {
  1: '上午',
  2: '下午'
};
const zhongriUrl = 'https://www.zryhyy.com.cn/schedul_interface/scheduling/schedulDataByHosCode';

const worksheetDic:any = {
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=001': '本部',
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=003': '北区',
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=002': '西区',
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=004': '国际部'
};

// 导出脚本创建器方法
export default function creater () {
  return createWorksheet(worksheetDic, getData, EHospitalName.中日友好医院);
}

// 处理html，返回生成表格需要的数据
async function getData (url:string, worksheet:any) {
  const result = [
    ['科室', '时间', '日期', '医生']
  ];
  const promises = [];
  const data:any = await request(url);
  // 获取科室列表
  const { data: facultyList } = JSON.parse(data);
  for (const faculty of facultyList) {
    promises.push(
      request(`${zhongriUrl}?hosCode=${faculty.hospitalcode}&depCode=${faculty.code1}`)
    );
  }
  const datas = await Promise.all(promises);
  for (const list of datas) {
    const { data: menzhenInfo } = JSON.parse(list as any);
    for (const facultyName in menzhenInfo) {
      const detail = menzhenInfo[facultyName];
      for (const period in detail) {
        const dateInfo = detail[period];
        for (const date in dateInfo) {
          for (const doctor of dateInfo[date]) {
            result.push([doctor.deptname, periodDic[period], date, doctor.doctname]);
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
