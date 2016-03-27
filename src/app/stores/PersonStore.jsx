import Reflux from 'reflux'

import PersonActions from '../actions/PersonActions'
import Person from '../models/person/Person'
import ServiceFactory from '../api/ServiceFactory'

let PersonStore = Reflux.createStore({
  listenables: PersonActions,

  init: function () {
    this.state = new Person()
  },

  getInitialState: function () {
    return this.state
  },

  onUpdatePerson: function (personId, reportId, teamId, callback) {
    ServiceFactory.getService('PersonService').findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (person, err) => {
      this.state = person
      this.trigger(this.state)
      callback(person, err)
    })
  },

  onAddPerson: function (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
    ServiceFactory.getService('PersonService').create(name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, (person, err) => {
      if (err === null) {
        this.state = person
        this.trigger(this.state)
      }
      if (typeof callback === 'function') {
        callback(person, err)
      }
    })
  },

  onEditPerson: function (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, callback) {
    ServiceFactory.getService('PersonService').update(personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, (person, err) => {
      this.state = person
      this.trigger(this.state)
      if (typeof callback === 'function') {
        callback(person, err)
      }
    })
  }

})

module.exports = PersonStore
