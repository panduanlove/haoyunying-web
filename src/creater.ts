import { hospitalKey } from './interface/IHospital';
import createBeijingxieheyiyuan from './crawler/beijingxieheyiyuan';
import createZhongriyouhaoyiyuan from './crawler/zhongriyouhaoyiyuan';
import createWuhantongjiyiyuan from './crawler/wuhantongjiyiyuan';
import createBeijingdaxuedisanyiyuan from './crawler/beijingdaxuedisanyiyuan';

const createrMap = {
  beijingxieheyiyuan: createBeijingxieheyiyuan,
  zhongriyouhaoyiyuan: createZhongriyouhaoyiyuan,
  wuhantongjiyiyuan: createWuhantongjiyiyuan,
  beijingdaxuedisanyiyuan: createBeijingdaxuedisanyiyuan
}

// 生成各医院表格的工厂方法
export default function creater (hospitalKey: hospitalKey) {
  return createrMap[hospitalKey];
}
