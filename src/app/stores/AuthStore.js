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
        this.setUser(user, function () {
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
          this.onLogIn(username, password, callback(user, err))
        }
      })
  },

  isLoggedIn: function () {
    return this.state.user !== null
  }

})

module.exports = AuthStore
