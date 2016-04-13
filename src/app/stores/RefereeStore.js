import Reflux from 'reflux'

import RefereeActions from '../actions/RefereeActions'
import ServiceFactory from '../api/ServiceFactory'

let RefereeStore = Reflux.createStore({
  listenables: RefereeActions,

  findByUserId: function (userId, callback) {
    ServiceFactory.getService('RefereeService').findByUserId(userId, callback)
  }

})

module.exports = RefereeStore
