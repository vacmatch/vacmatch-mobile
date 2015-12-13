import Reflux from 'reflux'

import ReportActions from '../actions/ReportActions'
import PersonService from '../services/PersonService'

let PersonListStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.state = {
      localPeople: [],
      visitorPeople: []
    }
  },

  getInitialState: function () {
    return this.state
  },

  onUpdatePlayers: function (reportId, localTeamId, visitorTeamId) {
    PersonService.findByReportIdAndTeamId(reportId, localTeamId, (data, err) => {
      if (err) {
        console.log('Error: ', err)
      } else {
        this.state.localPeople = data
        this.trigger(this.state)
      }
    })
    PersonService.findByReportIdAndTeamId(reportId, visitorTeamId, (data, err) => {
      if (err) {
        console.log('Error: ', err)
      } else {
        this.state.visitorPeople = data
        this.trigger(this.state)
      }
    })
  }

})

module.exports = PersonListStore
