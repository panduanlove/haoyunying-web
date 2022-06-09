export type hospitalKey =
  'beijingxieheyiyuan'
  | 'zhongriyouhaoyiyuan'

export type hospitalName =
  '北京协和医院'
  | '中日友好医院'
export default interface IHospital {
  key: hospitalKey,
  name: string
}
