//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import Reflux from 'reflux'

import EventActions from '../actions/EventActions'
import ReportActions from '../actions/ReportActions'
import ServiceFactory from '../api/ServiceFactory'
import AuthStore from './AuthStore'

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
      callback(events, err)
    })
  },

  onAddEvent: function (reportId, person, team, eventType, matchTime, cause, callback) {
    let timestamp = Date.now()
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('EventService').create(userId, reportId, person, team, eventType, matchTime, cause, timestamp, callback)
  },

  onAddControlEvent: function (reportId, eventType, matchTime, text, callback) {
    let timestamp = Date.now()
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('EventService').createControl(userId, reportId, eventType, matchTime, text, timestamp, callback)
  },

  onDeleteEvent: function (event, callback) {
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('EventService').deleteEvent(userId, event._id, (e, err) => {
      if (err !== null) {
        return callback(e, err)
      }
      // Update report
      ReportActions.updateReport(event.reportId, (report, err) => {
        if (err !== null) {
          return callback(report, err)
        }
        // Delete from state this event
        let filterList = this.state.filter(function (e) { return e._id !== event._id })
        this.state = filterList
        this.trigger(this.state)
        callback(e, err)
      })
    })
  }

})

module.exports = EventStore
