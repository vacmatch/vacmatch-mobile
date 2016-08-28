//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import Reflux from 'reflux'
import Stopwatch from 'timer-stopwatch'

import ReportActions from '../actions/ReportActions'

import ChangeTermEvent from '../models/web/event/control/ChangeTermEvent'
import StartMatchEvent from '../models/web/event/control/StartMatchEvent'
import EndMatchEvent from '../models/web/event/control/EndMatchEvent'
import GoalEvent from '../models/web/event/GoalEvent'
import FoulEvent from '../models/web/event/FoulEvent'
import ReportStatus from '../models/report/ReportStatus'
import AuthStore from '../stores/AuthStore'

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
//    this.state.report.localTeam.name = 'Local'
//    this.state.report.visitorTeam.name = 'Visitor'
    this.trigger(this.state)
    return this.state
  },

  onUpdateReport: function (reportId, callback) {
    let termEvent = new ChangeTermEvent()
    let startEvent = new StartMatchEvent()
    let endEvent = new EndMatchEvent()
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    // Update Teams
    ServiceFactory.getService('ReportService').findById(userId, reportId, (report, err) => {
      // TODO: Handle error
      if (err !== null) {
        return callback(report, err)
      }
      this.state.report = report
      // Check if match has started
      ServiceFactory.getService('EventService').findAllByReportIdAndEventType(reportId, startEvent.type, (startEvents, err) => {
        if (err !== null) {
          return callback(startEvents, err)
        }
        ServiceFactory.getService('EventService').findAllByReportIdAndEventType(reportId, endEvent.type, (endEvents, err) => {
          if (err !== null) {
            return callback(startEvents, err)
          }
          if (startEvents.length > 0) {
            this.state.report.status = ReportStatus.STARTED
          }
          if (endEvents.length > 0) {
            this.state.report.status = ReportStatus.FINISHED
          }
          // Update term
          ServiceFactory.getService('EventService').findAllByReportIdAndEventType(reportId, termEvent.type, (termEvents, err) => {
            if (err !== null) {
              return callback(termEvents, err)
            }
            if (termEvents.length) {
              this.state.term = termEvents[0].text
            } else {
              this.state.term = '1'
            }
            this.trigger(this.state)
            callback(report, null)
          })
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
    this.state.report.status = ReportStatus.STARTED
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
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('ReportService').update(userId, reportId, this.state.report.date, this.state.report.location, this.state.report.status,
      this.state.report.localTeam, this.state.report.visitorTeam, this.state.report.incidences, (newReport, err) => {
        if (err === null) {
          // Update state
          this.state.report.localTeam = newReport.localTeam
          this.state.report.visitorTeam = newReport.visitorTeam
          this.trigger(this.state)
        }
      })
  },

  onUpdateResultFields: function (event, sport, callback) {
    // Get all events
    ServiceFactory.getService('EventService').findAllByReportIdAndEventType(event.reportId, event.type, (events, err) => {
      if (err !== null) {
        return callback(events, err)
      }
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
      callback(events, null)
    })
  },

  onEditReport: function (reportId, date, location, status, localTeam, visitorTeam, incidences, callback) {
    let userId = AuthStore.state.user ? AuthStore.state.user._id : null
    ServiceFactory.getService('ReportService').update(userId, reportId, date, location, status, localTeam, visitorTeam, incidences, (report, err) => {
      if (err !== null) {
        return callback(report, err)
      }
      // Update state
      this.state.report = report
      this.trigger(this.state)
      callback(report, err)
    })
  }

})

module.exports = ReportStore
