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

import ReportActions from '../actions/ReportActions'
import ServiceFactory from '../api/ServiceFactory'
import ReportStatus from '../models/report/ReportStatus'
import AuthStore from '../stores/AuthStore'

let ReportListStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.state = {
      nextReports: [],
      lastReports: []
    }
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateLists: function (callback) {
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('ReportService').findAllByStatus(userId, ReportStatus.READY, (readyEvents, err) => {
      if (err !== null) {
        return callback(readyEvents, err)
      }
      ServiceFactory.getService('ReportService').findAllByStatus(userId, ReportStatus.STARTED, (startedEvents, err) => {
        if (err !== null) {
          return callback(startedEvents, err)
        }
        this.state.nextReports = readyEvents.concat(startedEvents)
        this.trigger(this.state)
      })
    })
    ServiceFactory.getService('ReportService').findAllByStatus(userId, ReportStatus.FINISHED, (events, err) => {
      if (err !== null) {
        return callback(events, err)
      }
      this.state.lastReports = events
      this.trigger(this.state)
    })
    callback(this.state, null)
  },

  onAddReport: function (date, location, localTeam, visitorTeam, refereeList, callback) {
    let status = ReportStatus.READY
    ServiceFactory.getService('ReportService').create(date, location, status, localTeam, visitorTeam, refereeList, (report, err) => {
      if (err !== null) {
        return callback(report, err)
      }
      this.onUpdateLists(callback)
    })
  },

  onDeleteReport: function (id, callback) {
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('ReportService').delete(userId, id, (res, err) => {
      if (err !== null) {
        return callback(res, err)
      } else {
        this.onUpdateLists(callback)
      }
    })
  }

})

module.exports = ReportListStore
