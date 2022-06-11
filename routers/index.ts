import express from 'express';
import path from 'path';
import fs from 'fs';
import { EHospitalDic } from '../src/enum/EHospital';
import { hospitalKey } from '../src/interface/IHospital';
import { creater, isSameDay } from '../src/util';
import hospitalList from '../data/hospitalList'

const router = express.Router();

router.get('/index.html', (req, res) => {
  res.status(200);
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

// 获取医院列表
router.get('/hospitalList', (req, res) => {
  const result = {
    errorCode: 0,
    data: hospitalList,
    msg: ''
  }
  res.json(result);
});

// 下载接口
router.get('/download', async (req, res) => {
  const hospitalKey = req.query.hospitalKey as hospitalKey;
  const hospitalName = EHospitalDic[hospitalKey];
  if (!hospitalName) {
    return res.json({
      errorCode: -1,
      msg: '当前医院不存在！'
    });
  }
  const filePath = path.resolve(__dirname, `../files/${hospitalName}.xlsx`);
  const fileName = path.basename(filePath);
  // 如果当前文件存在，并且是当天跑的脚本，直接导出
  if (fs.existsSync(filePath) && isSameDay(fs.statSync(filePath).ctime, new Date())) {
    return res.download(filePath, fileName);
  }
  // 爬取数据，写入文件中
  await creater(hospitalKey)();
  res.download(filePath, fileName);
});

export default router;
