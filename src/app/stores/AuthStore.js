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

import AuthActions from '../actions/AuthActions'
import ServiceFactory from '../api/ServiceFactory'

let AuthStore = Reflux.createStore({
  listenables: AuthActions,

  init: function () {
    this.state = {
      user: null
    }
  },

  getInitialState: function () {
    return this.state
  },

  setUser: function (newUser, callback) {
    this.state.user = newUser
    this.trigger(this.state)
    callback(newUser)
  },

  onLogIn: function (username, password, callback) {
    ServiceFactory.getService('AuthService').login(username, password, (user, err) => {
      if (err === null) {
        this.setUser(user, () => {
          callback(user, err)
        })
      } else {
        callback(user, err)
      }
    })
  },

  onLogOut: function (callback) {
    ServiceFactory.getService('AuthService').logout((response, err) => {
      if (err === null) {
        // Set an null active user in state
        this.setUser(null, () => {
          callback(response, err)
        })
      } else {
        callback(response, err)
      }
    })
  },

  onSignUp: function (username, password, secondPassword, email, firstName, surname, cardId, signKey, secondSignKey, callback) {
    // TODO: Add a default avatarUrl
    let avatarUrl = ''
    ServiceFactory.getService('AuthService').signup(username, password, secondPassword, avatarUrl, email, firstName,
      surname, cardId, signKey, secondSignKey, (user, err) => {
        if (err !== null) {
          callback(user, err)
        } else {
          this.onLogIn(username, password, callback)
        }
      })
  },

  isLoggedIn: function () {
    return this.state.user !== null
  }

})

module.exports = AuthStore
