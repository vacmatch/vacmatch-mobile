import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import ReportDao from '../dao/ReportDao'

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

  onUpdateLists: function () {
    ReportDao.findAll((data) => {
      let newState = {
        nextReports: data.rows,
        lastReports: data.rows
      }
      this.state = newState
      this.trigger(this.state)
    })
  },

  onAddReport: function (report) {
    ReportDao.save(report, (doc, err) => {
      if (err == null) {
        this.onUpdateLists()
      }
    })
  },

  onDeleteReport: function (id) {
    ReportDao.delete(id, (res, err) => {
      if (err == null) {
        this.onUpdateLists()
      }
    })
  }
})

module.exports = ReportListStore
