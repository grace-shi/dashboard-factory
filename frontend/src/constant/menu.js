import selfDriving from './configurations/selfDriving'
import staff from './configurations/staff'
import flight from './configurations/flight'
import match from './configurations/match'
import bossActivity from './configurations/bossActivity'
import construction from './configurations/construction'
import estate from './configurations/estate'

export default [{
  label: '单位情况',
  name: 'staff',
  config: staff
},
{
  label: '出行情况',
  name: 'selfDriving',
  config: selfDriving
},
{
  label: '飞行情况',
  name: 'flight',
  config: flight
},
{
  label: '专项活动',
  name: 'match',
  config: match
},
{
  label: '主要人员',
  name: 'bossActivity',
  config: bossActivity
},
{
  label: '工程建设',
  name: 'construction',
  config: construction
},
{
  label: '设备部署',
  name: 'estate',
  config: estate
}
]
