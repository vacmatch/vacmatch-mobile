import Reflux from 'reflux'
import Stopwatch from 'timer-stopwatch'

import ReportActions from '../actions/ReportActions'
import ReportService from '../services/ReportService'
import EventService from '../services/EventService'

import ChangeTermEvent from '../models/event/control/ChangeTermEvent'
import StartMatchEvent from '../models/event/control/StartMatchEvent'

import CronoUtils from './CronoUtils'

let ReportStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.state = {
      localTeam: {
        id: null,
        teamName: 'Local'
      },
      visitorTeam: {
        id: null,
        teamName: 'Visitor'
      },
      isPlaying: false,
      hasStarted: false,
      timer: new Stopwatch(1200000),
      time: CronoUtils.milisecondsToString(1200000),
      term: '1'
    }
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateReport: function (reportId) {
    let termEvent = new ChangeTermEvent()
    let startEvent = new StartMatchEvent()
    // Check if match has started
    EventService.findAllByReportIdAndEventType(reportId, startEvent.type, (startEvents) => {
      this.state.hasStarted = (startEvents.length > 0)
      // Update term
      EventService.findAllByReportIdAndEventType(reportId, termEvent.type, (termEvents) => {
        this.state.term = termEvents[0].text
        // Update Teams
        ReportService.find(reportId, (report) => {
          this.state.localTeam = report.doc.localTeam
          this.state.visitorTeam = report.doc.visitorTeam
          this.trigger(this.state)
        })
      })
    })
  },

  onUpdateTime: function () {
    this.state.timer.on('time', (time) => {
      this.state.time = CronoUtils.milisecondsToString(time.ms)
      this.trigger(this.state)
    })
    this.state.timer.startstop()
    this.state.isPlaying = !this.state.isPlaying
    this.trigger(this.state)
  },

  onResetTime: function (string) {
    let miliseconds = CronoUtils.stringToMiliseconds(string)
    this.state.timer.stop()
    this.state.isPlaying = false
    this.state.timer = new Stopwatch(miliseconds)
    this.state.time = CronoUtils.milisecondsToString(miliseconds)
    this.trigger(this.state)
  },

  onUpdateTerm: function (newTerm) {
    this.state.term = newTerm
    this.trigger(this.state)
  },

  onToggleStartMatch: function () {
    this.state.hasStarted = !this.state.hasStarted
    this.trigger(this.state)
  }

})

module.exports = ReportStore
