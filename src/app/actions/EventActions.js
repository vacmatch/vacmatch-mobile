import Reflux from 'reflux'

let EventActions = Reflux.createActions([
  'updateEventList',
  'addControlEvent',
  'addEvent'
])

module.exports = EventActions
