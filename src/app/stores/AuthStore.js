import Reflux from 'reflux'

import AuthService from '../services/AuthService'
import AuthActions from '../actions/AuthActions'
import RefereeService from '../services/RefereeService'

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
    if (typeof callback === 'function') {
      callback(newUser)
    }
  },

  onLogIn: function (username, password, callback) {
    AuthService.login(username, password, (user, err) => {
      if (err === null) {
        this.setUser(user, function () {
          if (typeof callback === 'function') {
            callback(user, err)
          }
        })
      } else {
        if (typeof callback === 'function') {
          callback(user, err)
        }
      }
    })
  },

  onLogOut: function (callback) {
    AuthService.logout((response, err) => {
      // Set an null active user in state
      this.setUser(null, () => {
        if (typeof callback === 'function') {
          callback(response, err)
        }
      })
    })
  },

  onSignUp: function (username, password, email, firstName, surname, cardId, signKey, callback) {
    AuthService.signup(username, password, email, firstName, surname, cardId, signKey, (response, err) => {
      if (err === null) {
        // TODO: Add a default avatarUrl
        let avatarUrl = ''
        let name = firstName + ' ' + surname
        let userId = response._id
        // When an user is created, a new referee is created too with this user
        RefereeService.create(name, cardId, avatarUrl, userId, (referee, err) => {
          if (err === null) {
            this.onLogIn(username, password, function (user, err) {
              if (typeof callback === 'function') {
                callback(user, err)
              }
            })
          }
        })
      }
      // Otherwise returns an error
      if (typeof callback === 'function') {
        callback(response, err)
      }
    })
  },

  isLoggedIn: function () {
    return this.state.user !== null
  }

})

module.exports = AuthStore
