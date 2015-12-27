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
    /*
      Se debería tener un string en Report que sea el estado del mismo para controlar si ha comenzado o terminado
      Cuando se añade un Event de inicio/fin o se eliminan también se debería modificar el estado dentro del Report
      Implementar tb 2 métodos para buscar partidos terminados y sin terminargit b
    */
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

  onAddReport: function (date, location, localTeam, visitorTeam, callback) {
    // Create both teams
    TeamService.save(localTeam.teamName, (local, err) => {
      localTeam.id = local._id
      TeamService.save(visitorTeam.teamName, (visitor, err) => {
        // Save new report
        visitorTeam.id = visitor._id
        let hasFinished = false
        ReportService.save(date, location, hasFinished, localTeam, visitorTeam, (doc, err) => {
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
