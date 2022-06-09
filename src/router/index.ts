import express from 'express';
import path from 'path';
import { EHospitalName, EHospitalDic } from '../enum/EHospital';
import IHospital, { hospitalKey } from '../interface/IHospital';
import { creater } from '../util';

const router = express.Router();

// 获取医院列表
router.get('/hospitalList', (req, res) => {
  // 医院列表
  const hospitalList: IHospital[] = [
    {
      key: 'beijingxieheyiyuan',
      name: EHospitalName.北京协和医院
    },
    {
      key: 'zhongriyouhaoyiyuan',
      name: EHospitalName.中日友好医院
    }
  ];
  res.json(hospitalList);
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
  // 爬取数据，写入文件中
  await creater(hospitalKey)();
  const filePath = path.resolve(__dirname, `../../files/${hospitalName}.xlsx`);
  const fileName = path.basename(filePath);
  // 加一些延迟，否则下载的文件可能还未写入完成
  setTimeout(() => {
    res.download(filePath, fileName);
  }, 300);
});

export default router;
