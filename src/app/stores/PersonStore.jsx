import Reflux from 'reflux'

import PersonService from '../services/PersonService'
import PersonActions from '../actions/PersonActions'

let PersonStore = Reflux.createStore({
  listenables: PersonActions,

  init: function () {
    this.state = {
      _id: '',
      name: '',
      cardId: '',
      dorsal: '',
      avatarUrl: '',
      isCalled: '',
      reportId: '',
      teamId: '',
      userId: ''
    }
  },

  getInitialState: function () {
    return this.state
  },

  onUpdatePerson: function (personId, reportId, teamId, callback) {
    PersonService.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (person, err) => {
      this.state = person
      this.trigger(this.state)
      callback(person, err)
    })
  },

  onAddPerson: function (name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, callback) {
    PersonService.create(name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, function (data, err) {
      if (err == null) {
        if (typeof callback === 'function') {
          callback(data, null)
        }
      } else {
        callback(null, err)
      }
    })
  },

  onEditPerson: function (personId, name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, callback) {
    PersonService.update(personId, name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, (person, err) => {
      this.state = person
      this.trigger(this.state)
      callback(person, err)
    })
  }
})

module.exports = PersonStore
