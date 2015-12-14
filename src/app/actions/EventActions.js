import Reflux from 'reflux'

let EventActions = Reflux.createActions([
  'getEventsByReportIdAndType',
  'updateEventList',
  'addControlEvent',
  'addEvent',
  'deleteEvent'
])

module.exports = EventActions
