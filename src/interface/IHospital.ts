export type hospitalKey =
  'beijingxieheyiyuan'
  | 'zhongriyouhaoyiyuan'
  | 'wuhantongjiyiyuan'
  | 'beijingdaxuedisanyiyuan'

export type hospitalName =
  '北京协和医院'
  | '中日友好医院'
  | '武汉同济医院'
  | '北京大学第三医院'
export default interface IHospital {
  key: hospitalKey,
  name: string
}
