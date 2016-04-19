import Reflux from 'reflux'

import EventActions from '../actions/EventActions'
import ServiceFactory from '../api/ServiceFactory'

let EventStore = Reflux.createStore({
  listenables: EventActions,

  init: function () {
    this.state = []
  },

  getInitialState: function () {
    return this.state
  },

  onGetEventsByReportIdAndType: function (reportId, eventType, callback) {
    ServiceFactory.getService('EventService').findAllByReportIdAndEventType(reportId, eventType, callback)
  },

  onUpdateEventList: function (reportId, callback) {
    ServiceFactory.getService('EventService').findAllByReportId(reportId, (events, err) => {
      if (err !== null) {
        return callback(events, err)
      }
      this.state = events
      this.trigger(this.state)
      if (typeof callback === 'function') {
        callback(events, err)
      }
    })
  },

  onAddEvent: function (reportId, person, team, eventType, matchTime, cause, callback) {
    let timestamp = Date.now()
    ServiceFactory.getService('EventService').create(reportId, person, team, eventType, matchTime, cause, timestamp, callback)
  },

  onAddControlEvent: function (reportId, eventType, matchTime, text, callback) {
    let timestamp = Date.now()
    ServiceFactory.getService('EventService').createControl(reportId, eventType, matchTime, text, timestamp, callback)
  },

  onDeleteEvent: function (event, callback) {
    ServiceFactory.getService('EventService').deleteEvent(event._id, (e, err) => {
      if (err !== null) {
        return callback(e, err)
      }
      // Delete from state this event
      let filterList = this.state.filter(function (e) { return e._id !== event._id })
      this.state = filterList
      this.trigger(this.state)
      callback(e, err)
    })
  }

})

module.exports = EventStore
