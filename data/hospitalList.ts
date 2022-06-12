import IHospital from '../src/interface/IHospital';
import { EHospitalName } from '../src/enum/EHospital';
// 医院列表
const hospitalList: IHospital[] = [
  {
    key: 'beijingxieheyiyuan',
    name: EHospitalName.北京协和医院
  },
  {
    key: 'zhongriyouhaoyiyuan',
    name: EHospitalName.中日友好医院
  },
  {
    key: 'wuhantongjiyiyuan',
    name: EHospitalName.武汉同济医院
  },
  {
    key: 'beijingdaxuedisanyiyuan',
    name: EHospitalName.北京大学第三医院
  }
];

export default hospitalList;
