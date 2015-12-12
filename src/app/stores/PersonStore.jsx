import Reflux from 'reflux'

import PersonService from '../services/PersonService'
import PersonActions from '../actions/PersonActions'

let PersonStore = Reflux.createStore({
  listenables: PersonActions,

  onAddPerson: function (name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, callback) {
    PersonService.save(name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, function (data, err) {
      if (!err) {
        if (typeof callback === 'function') {
          callback(data, null)
        }
      } else {
        callback(null, err)
      }
    })
  }
})

module.exports = PersonStore
