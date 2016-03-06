import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import ReportService from '../services/ReportService'

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
    ReportService.findAllByFinished(false, (events, err) => {
      this.state.nextReports = events
      this.trigger(this.state)
    })
    ReportService.findAllByFinished(true, (events, err) => {
      this.state.lastReports = events
      this.trigger(this.state)
    })
    if (typeof callback === 'function') {
      callback()
    }
  },

  onAddReport: function (date, location, localTeam, visitorTeam, refereeList, callback) {
    let hasFinished = false
    ReportService.create(date, location, hasFinished, localTeam, visitorTeam, refereeList, (doc, err) => {
      if (err !== null) {
        return callback(null, err)
      }
      this.onUpdateLists()
      callback(doc, null)
    })
  },

  onDeleteReport: function (id) {
    ReportService.delete(id, (res, err) => {
      if (err == null) {
        this.onUpdateLists()
      }
    })
  }

})

module.exports = ReportListStore
