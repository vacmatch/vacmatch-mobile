import Reflux from 'reflux'
import Stopwatch from 'timer-stopwatch'

import ReportActions from '../actions/ReportActions'
import ReportService from '../services/ReportService'
import EventActions from '../actions/EventActions'
import EventService from '../services/EventService'

import ChangeTermEvent from '../models/event/control/ChangeTermEvent'
import StartMatchEvent from '../models/event/control/StartMatchEvent'
import GoalEvent from '../models/event/GoalEvent'
import FoulEvent from '../models/event/FoulEvent'

import CronoUtils from './CronoUtils'

let ReportStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.state = {
      date: '',
      location: '',
      localTeam: {
        id: null,
        teamName: 'Local',
        result: 0,
        secondaryField: 0
      },
      visitorTeam: {
        id: null,
        teamName: 'Visitor',
        result: 0,
        secondaryField: 0
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

  onUpdateReport: function (reportId, callback) {
    let termEvent = new ChangeTermEvent()
    let startEvent = new StartMatchEvent()
    // Update Teams
    ReportService.find(reportId, (report) => {
      this.state.localTeam = report.localTeam
      this.state.visitorTeam = report.visitorTeam
      this.trigger(this.state)
    })
    // Check if match has started
    EventService.findAllByReportIdAndEventType(reportId, startEvent.type, (startEvents) => {
      this.state.hasStarted = (startEvents.length > 0)
      // Update term
      EventService.findAllByReportIdAndEventType(reportId, termEvent.type, (termEvents) => {
        if (termEvents.length) {
          this.state.term = termEvents[0].text
        }
        this.trigger(this.state)
      })
      callback()
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
  },

  updateTeam: function (reportId, newTeam) {
    // New result, state is updated when DB is updated too
    if (newTeam.id === this.state.localTeam.id) {
      this.state.localTeam = newTeam
    }
    if (newTeam.id === this.state.visitorTeam.id) {
      this.state.visitorTeam = newTeam
    }
    // Update result in DB
    ReportService.update(reportId, this.state.date, this.state.location,
      this.state.localTeam, this.state.visitorTeam, (newReport) => {
        // Update state
        this.state.localTeam = newReport.localTeam
        this.state.visitorTeam = newReport.visitorTeam
        this.trigger(this.state)
      })
  },

  onUpdateResultFields: function (event, sport, callback) {
    // Get all events
    EventService.findAllByReportIdAndEventType(event.reportId, event.type, (events, err) => {
      let goalEvent = new GoalEvent()
      if (event.type === goalEvent.type) {
        // Get the new value from Sport
        let newValue = sport.getPrimaryFieldValue(events, event.team.id)
        // Update team in report with new result
        if (event.team.id === this.state.localTeam.id) {
          this.state.localTeam.result = newValue
          this.updateTeam(event.reportId, this.state.localTeam)
        }
        if (event.team.id === this.state.visitorTeam.id) {
          this.state.visitorTeam.result = newValue
          this.updateTeam(event.reportId, this.state.visitorTeam)
        }
      }
      let foulEvent = new FoulEvent()
      if (event.type === foulEvent.type) {
        // Get the new value from Sport
        let newValue = sport.getSecondaryFieldValue(events, event.team.id)
        // Update team in report with new secondary result
        if (event.team.id === this.state.localTeam.id) {
          this.state.localTeam.secondaryField = newValue
          this.updateTeam(event.reportId, this.state.localTeam)
        }
        if (event.team.id === this.state.visitorTeam.id) {
          this.state.visitorTeam.secondaryField = newValue
          this.updateTeam(event.reportId, this.state.visitorTeam)
        }
      }
      callback()
    })
  }

})

module.exports = ReportStore
