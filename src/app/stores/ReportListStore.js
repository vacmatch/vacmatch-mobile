import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import ServiceFactory from '../api/ServiceFactory'
import ReportStatus from '../models/report/ReportStatus'

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
    ServiceFactory.getService('ReportService').findAllByStatus(ReportStatus.READY, (readyEvents, err) => {
      if (err !== null) {
        return callback(readyEvents, err)
      }
      ServiceFactory.getService('ReportService').findAllByStatus(ReportStatus.STARTED, (startedEvents, err) => {
        if (err !== null) {
          return callback(startedEvents, err)
        }
        this.state.nextReports = readyEvents.concat(startedEvents)
        this.trigger(this.state)
      })
    })
    ServiceFactory.getService('ReportService').findAllByStatus(ReportStatus.FINISHED, (events, err) => {
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
    ServiceFactory.getService('ReportService').delete(id, (res, err) => {
      if (err !== null) {
        return callback(res, err)
      } else {
        this.onUpdateLists(callback)
      }
    })
  }

})

module.exports = ReportListStore
