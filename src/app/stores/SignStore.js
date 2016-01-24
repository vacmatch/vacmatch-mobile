import Reflux from 'reflux'

import SignService from '../services/SignService'
import SignActions from '../actions/SignActions'
import AuthService from '../services/AuthService'

let SignStore = Reflux.createStore({
  listenables: SignActions,

  init: function () {
    this.state = []
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateSignatures: function (reportId, callback) {
    SignService.findAllByReportId(reportId, (data, err) => {
      if (err === null) {
        this.state = data
        this.trigger(this.state)
      }
      if (typeof callback === 'function') {
        callback(data, err)
      }
    })
  },

  /*
   * Sign a report
   */
  sign: function (userId, signKey, reportId, identifier, name, teamId, fedId, callback) {
    let stringToHash = '' // TODO: Add report info
    let timestamp = Date.now()
    SignService.create(userId, reportId, stringToHash, timestamp, identifier, name, teamId, fedId, (data, err) => {
      if (err === null) {
        this.state.push(data)
        this.trigger(this.state)
      }
      if (typeof callback === 'function') {
        callback(data, err)
      }
    })
  },

  /*
   * Sign report without user
   * Only created people in this APP can sign like this
   */
  onNonUserSignReport: function (reportId, identifier, name, teamId, callback) {
    this.sign(null, null, reportId, identifier, name, teamId, null, callback)
  },

  /*
   * Sign report with user and signkey
   * Referee or team people can sign
   */
  onUserSignReport: function (userId, signKey, reportId, identifier, name, teamId, fedId, callback) {
    // Check if signKey is valid
    AuthService.checkSignKey(userId, signKey, (value, err) => {
      // If sign key is not valid
      if (!value) {
        if (typeof callback === 'function') {
          callback(null, 'Invalid sign key')
        }
      } else {
        // If it's ok
        if (err === null) {
          this.sign(userId, signKey, reportId, identifier, name, teamId, fedId, callback)
        } else {
          if (typeof callback === 'function') {
            // Otherwhise send error
            callback(null, err)
          }
        }
      }
    })
  }

})

module.exports = SignStore
