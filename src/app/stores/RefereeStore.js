import Reflux from 'reflux'

import RefereeService from '../services/RefereeService'
import RefereeActions from '../actions/RefereeActions'

let RefereeStore = Reflux.createStore({
  listenables: RefereeActions,

  findByUserId: function (userId, callback) {
    RefereeService.findByUserId(userId, callback)
  }

})

module.exports = RefereeStore
