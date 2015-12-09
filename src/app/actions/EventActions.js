import Reflux from 'reflux'

let EventActions = Reflux.createActions([
  'getEventsByReportIdAndType',
  'updateEventList',
  'addControlEvent',
  'addEvent'
])

module.exports = EventActions
