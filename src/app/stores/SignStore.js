import Reflux from 'reflux'

import SignActions from '../actions/SignActions'
import ServiceFactory from '../api/ServiceFactory'
import AuthStore from './AuthStore'

let SignStore = Reflux.createStore({
  listenables: SignActions,

  init: function () {
    this.state = []
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateSignatures: function (reportId, callback) {
    ServiceFactory.getService('SignService').findAllByReportId(reportId, (data, err) => {
      if (err === null) {
        this.state = data
        this.trigger(this.state)
      }
      callback(data, err)
    })
  },

  /*
   * Sign a report
   */
  sign: function (userId, reportId, identifier, name, teamId, fedId, callback) {
    let stringToHash = '' // TODO: Add report info
    let timestamp = Date.now()
    ServiceFactory.getService('SignService').create(userId, reportId, stringToHash, timestamp, identifier, name, teamId, fedId, (data, err) => {
      if (err === null) {
        this.state.push(data)
        this.trigger(this.state)
      }
      callback(data, err)
    })
  },

  /*
   * Sign report without user
   * Only created people in this APP can sign like this
   */
  onNonUserSignReport: function (reportId, identifier, name, teamId, callback) {
    let stringToHash = '' // TODO: Add report info
    let timestamp = Date.now()
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('SignService').createWithoutUser(userId, reportId, stringToHash, timestamp, identifier, name, teamId, null, (data, err) => {
      if (err === null) {
        this.state.push(data)
        this.trigger(this.state)
      }
      callback(data, err)
    })
  },

  /*
   * Sign report with user and signkey
   * Referee or team people can sign
   */
  onUserSignReport: function (userId, signKey, reportId, identifier, name, teamId, fedId, callback) {
    // Check if signKey is valid
    ServiceFactory.getService('AuthService').checkSignKey(userId, signKey, (value, err) => {
      // If sign key is not valid

      if (!value) {
        callback(null, 'Invalid sign key')
      } else {
        // If it's ok
        if (err === null) {
          let stringToHash = '' // TODO: Add report info
          let timestamp = Date.now()
          ServiceFactory.getService('SignService').create(userId, reportId, stringToHash, timestamp, identifier, name, teamId, fedId, (data, err) => {
            if (err === null) {
              this.state.push(data)
              this.trigger(this.state)
            }
            callback(data, err)
          })
        } else {
          // Otherwhise send error
          callback(null, err)
        }
      }
    })
  }

})

module.exports = SignStore
