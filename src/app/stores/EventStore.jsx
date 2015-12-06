import Reflux from 'reflux'

import EventService from '../services/EventService'
import EventActions from '../actions/EventActions'

let EventStore = Reflux.createStore({
  listenables: EventActions,

  init: function () {
    this.state = []
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateEventList: function (reportId) {
    EventService.findAllByReportID(reportId, (data) => {
      this.state = data
      this.trigger(this.state)
    })
  },

  onAddEvent: function (reportId, person, team, eventType, matchTime, cause, callback) {
    let timestamp = Date.now()
    EventService.save(reportId, person, team, eventType, matchTime, cause, timestamp, function (data, err) {
      if (!err) {
        callback(data)
      }
    })
  },

  onAddControlEvent: function (reportId, eventType, matchTime, text, callback) {
    let timestamp = Date.now()
    EventService.saveControl(reportId, eventType, matchTime, text, timestamp, function (data, err) {
      if (!err) {
        callback(data)
      }
    })
  }
})

module.exports = EventStore
