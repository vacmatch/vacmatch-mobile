import Reflux from 'reflux'

import EventService from '../services/EventService'
import EventActions from '../actions/EventActions'

import ReportService from '../services/ReportService'

import EndMatchEvent from '../models/web/event/control/EndMatchEvent'

let EventStore = Reflux.createStore({
  listenables: EventActions,

  init: function () {
    this.state = []
  },

  getInitialState: function () {
    return this.state
  },

  onGetEventsByReportIdAndType: function (reportId, eventType, callback) {
    EventService.findAllByReportIdAndEventType(reportId, eventType, callback)
  },

  onUpdateEventList: function (reportId, callback) {
    EventService.findAllByReportId(reportId, (data) => {
      this.state = data
      this.trigger(this.state)
      if (typeof callback === 'function') {
        callback()
      }
    })
  },

  onAddEvent: function (reportId, person, team, eventType, matchTime, cause, callback) {
    let timestamp = Date.now()
    EventService.create(reportId, person, team, eventType, matchTime, cause, timestamp, callback)
  },

  onAddControlEvent: function (reportId, eventType, matchTime, text, callback) {
    let timestamp = Date.now()
    EventService.createControl(reportId, eventType, matchTime, text, timestamp, callback)
  },

  onDeleteEvent: function (event, callback) {
    EventService.deleteEvent(event._id, (data, err) => {
      if (err == null) {
        // Delete from state this event
        let filterList = this.state.filter(function (e) { return e._id !== event._id })
        this.state = filterList
        this.trigger(this.state)
        callback(data, err)
      }
      callback(data, err)
    })
  }

})

module.exports = EventStore
