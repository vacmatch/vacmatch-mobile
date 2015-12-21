import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import PersonService from '../services/PersonService'
import PersonActions from '../actions/PersonActions'

let PersonListStore = Reflux.createStore({
  listenables: [ReportActions, PersonActions],

  init: function () {
    this.state = {
      localTeamId: null,
      localPeople: [],
      visitorTeamId: null,
      visitorPeople: []
    }
  },

  getInitialState: function () {
    return this.state
  },

  onUpdatePlayers: function (reportId, localTeamId, visitorTeamId, callback) {
    PersonService.findByReportIdAndTeamId(reportId, localTeamId, (data, err) => {
      if (err) {
        console.log('Error: ', err)
      } else {
        this.state.localPeople = data
        this.state.localTeamId = localTeamId
        this.trigger(this.state)
      }
      if (typeof callback === 'function') {
        callback()
      }
    })
    PersonService.findByReportIdAndTeamId(reportId, visitorTeamId, (data, err) => {
      if (err) {
        console.log('Error: ', err)
      } else {
        this.state.visitorPeople = data
        this.state.visitorTeamId = visitorTeamId
        this.trigger(this.state)
      }
    })
  },

  updatePersonInLists: function (person, teamId, callback) {
    // Update player in local Team list
    if (teamId === this.state.localTeamId) {
      let index = this.state.localPeople.findIndex(function (e, index) {
        return (e.id === person.id)
      })
      this.state.localPeople[index] = person
    }
    // Update player in visitor Team list
    if (teamId === this.state.visitorTeamId) {
      let index = this.state.visitorPeople.findIndex(function (e, index) {
        return (e.id === person.id)
      })
      this.state.visitorPeople[index] = person
    }
    this.trigger(this.state)
    if (typeof callback === 'function') {
      callback()
    }
  },

  onToggleCallPerson: function (personId, reportId, teamId, newValue) {
    // Set new call state in DB
    PersonService.setCalledValue(personId, reportId, teamId, newValue, (person, err) => {
      // Update call state in person list
      this.updatePersonInLists(person, teamId)
    })
  },

  onUpdatePersonDorsal: function (personId, reportId, teamId, newDorsal, callback) {
    // Set new dorsal in DB
    PersonService.setDorsal(personId, reportId, teamId, newDorsal, (person, err) => {
      // Update dorsal in person list
      this.updatePersonInLists(person, teamId, function () {
        callback(person, err)
      })
    })
  }

})

module.exports = PersonListStore
