import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import PersonActions from '../actions/PersonActions'
import ServiceFactory from '../api/ServiceFactory'

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
    ServiceFactory.getService('PersonService').findByReportIdAndTeamId(reportId, localTeamId, (data, err) => {
      if (err !== null) {
        return callback(localTeamId, err)
      } else {
        this.state.localPeople = data
        this.state.localTeamId = localTeamId
        this.trigger(this.state)
      }
      ServiceFactory.getService('PersonService').findByReportIdAndTeamId(reportId, visitorTeamId, (data, err) => {
        if (err !== null) {
          return callback(visitorTeamId, err)
        } else {
          this.state.visitorPeople = data
          this.state.visitorTeamId = visitorTeamId
          this.trigger(this.state)
        }
        if (typeof callback === 'function') {
          callback(reportId, null)
        }
      })
    })
  },

  updatePersonInLists: function (person, teamId, callback) {
    // Update player in local Team list
    if (teamId === this.state.localTeamId) {
      let index = this.state.localPeople.findIndex(function (e, index) {
        return (e._id === person._id)
      })
      this.state.localPeople[index] = person
      this.trigger(this.state)
    }
    // Update player in visitor Team list
    if (teamId === this.state.visitorTeamId) {
      let index = this.state.visitorPeople.findIndex(function (e, index) {
        return (e._id === person._id)
      })
      this.state.visitorPeople[index] = person
      this.trigger(this.state)
    }
    if (typeof callback === 'function') {
      callback()
    }
  },

  onToggleCallPerson: function (personId, reportId, teamId, newValue) {
    // Set new call state in DB
    ServiceFactory.getService('PersonService').setCalledValue(personId, reportId, teamId, newValue, (person, err) => {
      // Update call state in person list
      this.updatePersonInLists(person, teamId)
    })
  },

  onUpdatePersonDorsal: function (personId, reportId, teamId, newDorsal, callback) {
    // Set new dorsal in DB
    ServiceFactory.getService('PersonService').setDorsal(personId, reportId, teamId, newDorsal, (person, err) => {
      // Update dorsal in person list
      this.updatePersonInLists(person, teamId, function () {
        callback(person, err)
      })
    })
  },

  onDeletePerson: function (personId, reportId, teamId, callback) {
    ServiceFactory.getService('PersonService').deletePerson(personId, reportId, teamId, (data, err) => {
      if (err === null) {
        // Check witch team and update that team list removing this person
        if (teamId === this.state.localTeamId) {
          let newList = this.state.localPeople.filter(function (e, index) {
            return ((e._id !== personId) && (e.teamId === teamId) && (e.reportId === reportId))
          })
          this.state.localPeople = newList
          this.trigger(this.state)
        }
        if (teamId === this.state.visitorTeamId) {
          let newList = this.state.visitorPeople.filter(function (e, index) {
            return ((e._id !== personId) && (e.teamId === teamId) && (e.reportId === reportId))
          })
          this.state.visitorPeople = newList
          this.trigger(this.state)
        }
      }
      if (typeof callback === 'function') {
        callback(data, err)
      }
    })
  }

})

module.exports = PersonListStore
