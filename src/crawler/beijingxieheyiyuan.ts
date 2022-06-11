/**
 * 北京协和医院医生出诊时间表
 */
import cheerio from 'cheerio';
import { createWorksheet, setColumn, setRow } from '../worksheet';
import { request } from '../util';
import { EHospitalName } from '../enum/EHospital';
import IWooksheetDic from '../interface/IWooksheetDIc'

const worksheetDic: IWooksheetDic = {
  'https://www.pumch.cn/dsearchs/dockervisit/3/1.html?ajax=true': '普通门诊(东院)',
  'https://www.pumch.cn/dsearchs/dockervisit/3/2.html?ajax=true': '特需专家门诊(东院)',
  'https://www.pumch.cn/dsearchs/dockervisit/3/3.html?ajax=true': '国际医疗部门诊(东院)',
  'https://www.pumch.cn/dsearchs/dockervisit/2/1.html?ajax=true': '普通门诊(西院)',
  'https://www.pumch.cn/dsearchs/dockervisit/2/2.html?ajax=true': '特需专家门诊(西院)',
  'https://www.pumch.cn/dsearchs/dockervisit/2/3.html?ajax=true': '国际医疗部门诊(西院)'
};

// 导出脚本创建器方法
export default function creater () {
  return createWorksheet(worksheetDic, getDoctorInfo, EHospitalName.北京协和医院);
}

/**
  *
  * @param {需要爬取的url地址} url
  * @param {对应的sheet} worksheet
  * @returns
  */
async function getDoctorInfo (url:string, worksheet:any) {
  const { data } = await request(url);
  const result = getData(data);
  worksheet.addRows(result)
  setColumn(worksheet);
  setRow(worksheet);
  return result;
}

// 处理html，返回生成表格需要的数据
function getData (html:any) {
  const $ = cheerio.load(html);
  const data = [];
  const list:any = [];
  // 表头处理
  $('.tableth th').each(function (index, ele) {
    list.push($(ele).text().trim());
  });

  data.push(list);
  let facultyName = '';
  $('.h5-table tr').each(function (index, ele) {
    const result:any = [];
    $(ele).children().each(function (idx, el) {
      const item = $(el).text().trim().replace(/\n/g, '、').replace(/\s*/g, '');
      if (idx === 0 && !['上午', '下午', '晚上'].includes(item)) {
        facultyName = item;
      }
      if (idx === 0 && ['上午', '下午', '晚上'].includes(item)) {
        result.push(facultyName, item);
      } else {
        result.push(item);
      }
    });
    data.push(result);
  });
  return formatData(data);
}

/**
  * 格式化数据
  * @param {*} data
  * 返回如下格式数据
  *
  * [
       [ '科室', '时间', '日期', '医生' ],
       [ '整形外科门诊(西院)1', '上午', '2022.06.08星期三', '刘志飞' ],
       [ '整形外科门诊(西院)1', '上午', '2022.06.13星期一', '黄渭清' ],
       [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '邓姗' ],
       [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '周远征' ],
       [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '王含必' ],
       [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '孙正怡' ]
    ]
  */
function formatData (data:any) {
  const weekDic = Object.create(null);
  const headList = data[0];
  const result = [
    ['科室', '时间', '日期', '医生']
  ];
  for (let i = 2; i < headList.length; i++) {
    weekDic[i] = headList[i];
  }
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const facultyName = row[0];
    const period = row[1];
    for (let i = 2; i < row.length; i++) {
      const doctorName = row[i];
      const date = formatDate(weekDic[i]);
      if (doctorName === '—') {
        continue;
      } else if (doctorName.includes('、')) {
        doctorName.split('、').forEach((doctor:any) => {
          result.push([facultyName, period, date, doctor]);
        });
      } else {
        result.push([facultyName, period, date, doctorName]);
      }
    }
  }
  return result;
}

function formatDate (date: string) {
  return date.replace(/(\d{4})\.(\d{2})\.(\d{2}).*/, '$1-$2-$3');
}
