/**
 * 武汉同济医院医生出诊时间表
 */
import axios from 'axios'
import { EHospitalName } from '../enum/EHospital'
import { createWorksheet, setColumn, setRow } from '../worksheet';
import IWooksheetDic from '../interface/IWooksheetDIc'

const periodDic: {[key: string]: string} = {
  0: '上午',
  1: '下午'
};

const hospitalPlaceUrl = 'https://www.tjh.com.cn/api/v1/tjhsite/GetDept';
const clinicUrl = 'https://www.tjh.com.cn/api/v1/tjhsite/GetArrange';

const worksheetDic: IWooksheetDic = {
  0: '主院区',
  1: '光谷院区',
  2: '中法新城院区'
};

// 导出脚本创建器方法
export default function creater () {
  return createWorksheet(worksheetDic, getData, EHospitalName.武汉同济医院);
}

// 处理html，返回生成表格需要的数据
async function getData (hospitalCode:string, worksheet:any) {
  const url = `${hospitalPlaceUrl}?Hospital=${hospitalCode}`;
  const result = [
    ['科室', '时间', '日期', '医生']
  ];
  const promises = [];
  const { data } = await axios.post(url);
  // 获取科室列表
  const { data: facultyList } = data;
  for (const faculty of facultyList) {
    promises.push(
      axios.post(`${clinicUrl}?Hospital=${hospitalCode}&BelongClinicCode=${faculty.belongcliniccode}`)
    );
  }
  const datas = await Promise.all(promises);
  for (const response of datas) {
    const { data: { data: menzhenInfo } } = response;
    for (const dateInfo of menzhenInfo) {
      for (const doctor of dateInfo) {
        result.push([doctor.zhuanke, periodDic[doctor.shangwu], formatDate(doctor.riqi), doctor.xingming]);
      }
    }
  }
  worksheet.addRows(result);
  setColumn(worksheet);
  setRow(worksheet);
  return result;
}

function formatDate (date: string) {
  return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
}
