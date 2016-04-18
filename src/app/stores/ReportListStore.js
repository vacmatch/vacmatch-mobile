import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import ServiceFactory from '../api/ServiceFactory'

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
    ServiceFactory.getService('ReportService').findAllByFinished(false, (events, err) => {
      if (err !== null) {
        return callback(events, err)
      }
      this.state.nextReports = events
      this.trigger(this.state)
    })
    ServiceFactory.getService('ReportService').findAllByFinished(true, (events, err) => {
      if (err !== null) {
        return callback(events, err)
      }
      this.state.lastReports = events
      this.trigger(this.state)
    })
    if (typeof callback === 'function') {
      callback(this.state, null)
    }
  },

  onAddReport: function (date, location, localTeam, visitorTeam, refereeList, callback) {
    let hasFinished = false
    ServiceFactory.getService('ReportService').create(date, location, hasFinished, localTeam, visitorTeam, refereeList, (doc, err) => {
      if (err !== null) {
        return callback(null, err)
      }
      this.onUpdateLists()
      callback(doc, null)
    })
  },

  onDeleteReport: function (id, callback) {
    ServiceFactory.getService('ReportService').delete(id, (res, err) => {
      if (err !== null) {
        return callback(res, err)
      } else {
        this.onUpdateLists()
      }
    })
  }

})

module.exports = ReportListStore
