/**
 * 北京协和医院医生出诊时间表
 */
import cheerio from 'cheerio';
import { createWorksheet, setRow } from '../worksheet';
import axios from 'axios';
import { EHospitalName } from '../enum/EHospital';
import IWooksheetDic from '../interface/IWooksheetDIc'

type facultyList = {facultyName: string, deptKey: string}[];

const hospitalUrl = 'https://zhcx.puh3.net.cn:8081/index.php/seek/ctz';

const worksheetDic: IWooksheetDic = {
  [hospitalUrl]: EHospitalName.北京大学第三医院
};

// 导出脚本创建器方法
export default function creater () {
  return createWorksheet(worksheetDic, getDoctorInfo, EHospitalName.北京大学第三医院);
}

/**
   *
   * @param {需要爬取的url地址} url
   * @param {对应的sheet} worksheet
   * @returns
   */
async function getDoctorInfo (url:string, worksheet:any) {
  const { data } = await axios.get(url);
  const result:any = await getData(getFacultyList(data));
  worksheet.addRows(result)
  setColumn(worksheet);
  setRow(worksheet);
  return result;
}

// 获取科室列表
function getFacultyList (html: string) {
  const $ = cheerio.load(html);
  const facultyList: facultyList = [];
  const options = $('#deptKey').find('option');
  options.each(function (index, ele: any) {
    facultyList.push({
      facultyName: $(ele).text().trim(),
      deptKey: $(ele).val() as string
    });
  });
  return facultyList;
}

// 返回生成表格需要的数据
async function getData (facultyList: facultyList) {
  const result:any = [
    ['科室', '时间', '日期', '医生', '停诊信息']
  ];
  const promises = [];
  try {
    // console.time('遍历科室页面');
    for (const faculty of facultyList) {
      promises.push(axios.get(`${hospitalUrl}?deptKey=${faculty.deptKey}`));
    }
    const datas = await Promise.all(promises);
    // console.timeEnd('遍历科室页面');
    for (const response of datas) {
      const { data } = response;
      const res:[] = getDataFromHtml(data);
      result.push(...res);
      const $ = cheerio.load(data);

      // 如果有分页
      if ($('.sabrosus').children().length > 1 && $('.sabrosus').find('.current').text() === '1') {
        const pages = $('.sabrosus').children().length - 1;
        const deptKey = $('#deptKey').val() as string;
        const res:[] = await getRemainPageData(pages, deptKey);
        result.push(...res);
      }
    }
    return result;
  } catch (error) {
    console.log(error)
  }

  return result;
}

function getDataFromHtml (html:string) {
  const result: any = [];
  const $ = cheerio.load(html);
  const rows = $('#list').find('tr');
  rows.each(function (index, ele) {
    const row: string[] = [];
    $(ele).children().each(function (idx, td) {
      row.push($(td).text());
    });
    if (row[0] !== '没有查询到数据！') {
      const clinics = splitWeek(row[4]);
      clinics?.forEach((clinic: string) => {
        result.push([
          row[0],
          clinic.slice(2) + '午',
          clinic.slice(0, 2),
          row[1],
          row[5]
        ]);
      });
    }
  });
  return result;
}

// 如果有分页，获取第二页及以后的数据
async function getRemainPageData (pages: number, deptKey: string) {
  const result:any = [];
  const promises = [];
  for (let i = 1; i < pages; i++) {
    const page = i + 1;
    const url = `${hospitalUrl}/deptKey/${deptKey}/p/${page}.html`;
    promises.push(axios.get(url));
  }
  const datas = await Promise.all(promises);
  for (const response of datas) {
    const { data: html } = response;
    const res = getDataFromHtml(html);
    result.push(...res);
  }
  return result;
}

function splitWeek (str: string) {
  return str.match(/(周[一|二|三|四|五|六|日])([上|下])/g);
}

// 设置列
export function setColumn (worksheet:any) {
  // 设置列
  worksheet.columns = [
    { key: 'facultyName', width: 40 },
    { key: 'period', width: 15 },
    { key: 'date', width: 40 },
    { key: 'doctor', width: 40 },
    { key: 'stopInfo', width: 40 }
  ];
}
