import path from 'path';
import fs from 'fs';
import IWooksheetDic from './interface/IWooksheetDIc';
import { hospitalName } from './interface/IHospital'
const Excel = require('exceljs');

interface IDataFn<T> {
  (url: string, worksheet: any): T
}

/**
 * 创建、设置工作表相关
 */
export function createWorkbook () {
  const workbook = new Excel.Workbook();
  // 基本的创建信息
  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Her';
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);
  // 视图大小， 打开Excel时，整个框的位置，大小
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      firstSheet: 0,
      activeTab: 0,
      visibility: 'visible'
    }
  ];
  return workbook;
}

/**
 *
 * @param worksheetDic wooksheet 字典
 * @param dataFn 获取写入excel的格式后的数据
 * @param hospitalName 医院名称
 * @returns 医院医生出诊信息二维数组
 */
export async function createWorksheet (
  worksheetDic: IWooksheetDic,
  dataFn: IDataFn<Promise<any>>,
  hospitalName: hospitalName
) {
  const workbook = createWorkbook();
  const promises = [];
  for (const url in worksheetDic) {
    // 创建带颜色的sheet
    const worksheet = workbook.addWorksheet(worksheetDic[url], { properties: { tabColor: { argb: '01763a' } } });
    promises.push(dataFn(url, worksheet));
  }
  const result = await Promise.all(promises);
  await saveWookBook(workbook, hospitalName);
  return result;
}

// 保存表格
export function saveWookBook (workbook: any, filename: string) {
  return new Promise((resolve, reject) => {
    const dirpath = path.resolve(__dirname, '../files');
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath);
    }
    const filepath = `${dirpath}/${filename}.xlsx`;
    workbook.xlsx.writeFile(filepath, {
      encoding: 'utf8'
    }).then(() => {
      console.log('保存成功');
      resolve(true);
    }, (err:any) => {
      console.log('保存失败', err);
      reject(new Error());
    });
  });
}

// 设置列
export function setColumn (worksheet:any) {
  // 设置列
  worksheet.columns = [
    { key: 'facultyName', width: 40 },
    { key: 'period', width: 15 },
    { key: 'date', width: 40 },
    { key: 'doctor', width: 40 }
  ];
}

// 设置行
export function setRow (worksheet:any) {
  // 设置行
  worksheet.eachRow(function (row:any, rowNumber:number) {
    row.height = 30;
    row.eachCell(function (cell:any) {
      // 表头样式
      if (rowNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '01763a' },
          bgColor: { argb: 'ffffff' }
        };
        cell.font = {
          name: 'Arial',
          color: { argb: 'ffffff' },
          family: 2,
          size: 14
        };
      } else {
        cell.font = {
          name: 'Arial',
          color: { argb: '000000' },
          family: 2,
          size: 12
        };
      }
      // 设置单元格对齐方式
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });
  });
}
