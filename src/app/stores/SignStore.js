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
  sign: function (userId, signKey, reportId, personId, personName, teamId, refereeId, refereeName, callback) {
    let stringToHash = '' // report
    let timestamp = Date.now()
    SignService.create(userId, reportId, stringToHash, timestamp, personId, personName, teamId, refereeId, refereeName, (data, err) => {
      if (err === null) {
        this.state.push(data)
        this.trigger(this.state)
      }
      if (typeof callback === 'function') {
        // TODO: CHECK RETURN VALUE!!!!
        callback(data, err)
      }
    })
  },

  /*
   * Sign report without user
   * Only created people in this APP can sign like this
   */
  onNonUserSignReport: function (reportId, personId, personName, teamId, callback) {
    this.sign(null, null, reportId, personId, personName, teamId, null, null, callback)
  },

  /*
   * Sign report with user and signkey
   * Referee or team people can sign
   */
  onUserSignReport: function (userId, signKey, reportId, personId, personName, teamId, refereeId, refereeName, callback) {
    // Check if signKey is valid
    AuthService.checkSignKey(userId, signKey, (value, err) => {
      // If it's ok
      if ((err === null) && (value)) {
        this.sign(userId, signKey, reportId, personId, personName, teamId, refereeId, refereeName, callback)
      } else {
        if (typeof callback === 'function') {
          // TODO: CHECK RETURN VALUE!!!!
          callback(null, err)
        }
      }
    })
  }

})

module.exports = SignStore
