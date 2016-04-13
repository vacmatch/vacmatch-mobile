import Reflux from 'reflux'
import Stopwatch from 'timer-stopwatch'

import ReportActions from '../actions/ReportActions'

import ChangeTermEvent from '../models/web/event/control/ChangeTermEvent'
import StartMatchEvent from '../models/web/event/control/StartMatchEvent'
import GoalEvent from '../models/web/event/GoalEvent'
import FoulEvent from '../models/web/event/FoulEvent'

import CronoUtils from './CronoUtils'
import Report from '../models/report/Report'

import ServiceFactory from '../api/ServiceFactory'

let ReportStore = Reflux.createStore({
  listenables: ReportActions,

  init: function () {
    this.state = {
      report: new Report(),
      isPlaying: false,
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
    ServiceFactory.getService('ReportService').findById(reportId, (report, err) => {
      // TODO: Handle error
      if (err !== null) {
        if (typeof callback === 'function') {
          callback()
        }
      }
      this.state.report = report
      // Check if match has started
      ServiceFactory.getService('EventService').findAllByReportIdAndEventType(reportId, startEvent.type, (startEvents) => {
        this.state.report.hasFinished = (startEvents.length > 0)
        // Update term
        ServiceFactory.getService('EventService').findAllByReportIdAndEventType(reportId, termEvent.type, (termEvents) => {
          if (termEvents.length) {
            this.state.term = termEvents[0].text
          } else {
            this.state.term = '1'
          }
          this.trigger(this.state)
          if (typeof callback === 'function') {
            callback()
          }
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
    this.state.report.hasFinished = !this.state.report.hasFinished
    this.trigger(this.state)
  },

  updateTeam: function (reportId, newTeam) {
    // New result, state is updated when DB is updated too
    if (newTeam._id === this.state.report.localTeam._id) {
      this.state.report.localTeam = newTeam
    }
    if (newTeam._id === this.state.report.visitorTeam_id) {
      this.state.report.visitorTeam = newTeam
    }
    // Update result in DB
    ServiceFactory.getService('ReportService').update(reportId, this.state.report.date, this.state.report.hasFinished, this.state.report.location,
      this.state.report.localTeam, this.state.report.visitorTeam, this.state.report.incidences, (newReport) => {
        // Update state
        this.state.report.localTeam = newReport.localTeam
        this.state.report.visitorTeam = newReport.visitorTeam
        this.trigger(this.state)
      })
  },

  onUpdateResultFields: function (event, sport, callback) {
    // Get all events
    ServiceFactory.getService('EventService').findAllByReportIdAndEventType(event.reportId, event.type, (events, err) => {
      let goalEvent = new GoalEvent()
      if (event.type === goalEvent.type) {
        // Get the new value from Sport
        let newValue = sport.getPrimaryFieldValue(events, event.team._id)
        // Update team in report with new result
        if (event.team._id === this.state.report.localTeam._id) {
          this.state.report.localTeam.result = newValue
          this.updateTeam(event.reportId, this.state.report.localTeam)
        }
        if (event.team._id === this.state.report.visitorTeam._id) {
          this.state.report.visitorTeam.result = newValue
          this.updateTeam(event.reportId, this.state.report.visitorTeam)
        }
      }
      let foulEvent = new FoulEvent()
      if (event.type === foulEvent.type) {
        // Get the new value from Sport
        let newValue = sport.getSecondaryFieldValue(events, event.team._id)
        // Update team in report with new secondary result
        if (event.team._id === this.state.report.localTeam._id) {
          this.state.report.localTeam.secondaryField = newValue
          this.updateTeam(event.reportId, this.state.report.localTeam)
        }
        if (event.team._id === this.state.report.visitorTeam._id) {
          this.state.report.visitorTeam.secondaryField = newValue
          this.updateTeam(event.reportId, this.state.report.visitorTeam)
        }
      }
      if (typeof callback === 'function') {
        callback()
      }
    })
  },

  onEditReport: function (reportId, date, location, hasFinished, localTeam, visitorTeam, incidences, callback) {
    ServiceFactory.getService('ReportService').update(reportId, date, location, hasFinished, localTeam, visitorTeam, incidences, (report, err) => {
      // Update state
      this.state.report = report
      this.trigger(this.state)
      if (typeof callback === 'function') {
        callback(report, err)
      }
    })
  }

})

module.exports = ReportStore
