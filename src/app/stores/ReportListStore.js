import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import ReportService from '../services/ReportService'
import TeamService from '../services/TeamService'

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
    ReportService.findAll((data) => {
      let newState = {
        nextReports: data.rows,
        lastReports: data.rows
      }
      this.state = newState
      this.trigger(this.state)
      if (typeof callback === 'function') {
        callback()
      }
    })
  },

  onAddReport: function (date, location, localTeam, visitorTeam, callback) {
    // Create both teams
    TeamService.save(localTeam.teamName, (local, err) => {
      localTeam.id = local._id
      TeamService.save(visitorTeam.teamName, (visitor, err) => {
        // Save new report
        visitorTeam.id = visitor._id
        ReportService.save(date, location, localTeam, visitorTeam, (doc, err) => {
          if (err == null) {
            this.onUpdateLists()
            callback(doc, null)
          }
        })
      })
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
