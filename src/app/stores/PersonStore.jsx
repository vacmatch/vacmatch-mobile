//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import Reflux from 'reflux'

import PersonActions from '../actions/PersonActions'
import Person from '../models/person/Person'
import ServiceFactory from '../api/ServiceFactory'
import AuthStore from './AuthStore'

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
      if (err === null) {
        this.state = person
        this.trigger(this.state)
      }
      callback(person, err)
    })
  },

  onAddPerson: function (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
    let refereeUserId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('PersonService').create(refereeUserId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, (person, err) => {
      if (err === null) {
        this.state = person
        this.trigger(this.state)
      }
      callback(person, err)
    })
  },

  onEditPerson: function (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, callback) {
    ServiceFactory.getService('PersonService').update(personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, (person, err) => {
      if (err === null) {
        this.state = person
        this.trigger(this.state)
      }
      callback(person, err)
    })
  }

})

module.exports = PersonStore
