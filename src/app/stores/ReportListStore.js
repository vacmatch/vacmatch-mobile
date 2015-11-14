import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import ReportDao from '../dao/ReportDao'

let ReportListStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.reports = []
  },

  getInitialState: function () {
    return this.reports
  },

  onUpdateList: function () {
    ReportDao.findAll((data) => {
      this.reports = data.rows
      this.trigger(this.reports)
    })
  },

  onAddReport: function (report) {
    ReportDao.save(report, function (doc, err) {
      if (err == null) {
        this.reports.push(doc)
        this.trigger(this.reports)
      }
    }.bind(this))
  },

  onDeleteReport: function (id) {
    ReportDao.delete(id, (res, err) => {
      if (err == null) {
        this.onUpdateList()
      }
    })
  }
})

module.exports = ReportListStore
