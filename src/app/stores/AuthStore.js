import Reflux from 'reflux'

import AuthService from '../services/AuthService'
import AuthActions from '../actions/AuthActions'

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

  onSignUp: function (username, password, email, firstName, surname, cardId, callback) {
    AuthService.signup(username, password, email, firstName, surname, cardId, (user, err) => {
      if (err === null) {
        this.onLogIn(user.username, user.password, function (user, err) {
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

  isLoggedIn: function () {
    return this.state.user !== null
  }

})

module.exports = AuthStore
