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

import EventDao from '../daos/EventDao'
import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'
import ReportStatusManager from '../models/report/ReportStatusManager'
import ReportStatusException from '../models/exception/ReportStatusException'

class EventService {

  constructor (reportService, personService, teamService) {
    this.ReportService = reportService
    this.PersonService = personService
    this.TeamService = teamService
  }

  /**
    * Get an Event by Id
    * @param {String} id The event identifier
    * @param {eventCallback} callback A callback that returns an event
    */
  findById (eventId, callback) {
    EventDao.findById(eventId, callback)
  }

  /**
    * Get all Events from a Report
    * @param {String} reportId The report identifier
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportId (reportId, callback) {
    EventDao.findAllByReportId(reportId, callback)
  }

  /**
    * Get all Events from this EventType in a Report
    * @param {String} reportId The report identifier
    * @param {String} eventType The string that represents an EventType
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportIdAndEventType (reportId, eventType, callback) {
    EventDao.findAllByReportIdAndEventType(reportId, eventType, callback)
  }

  /**
    * Get all Events from this Report and Person
    * @param {String} reportId The report identifier
    * @param {String} personId The person identifier
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportIdAndPersonId (reportId, personId, callback) {
    EventDao.findAllByReportIdAndPersonId(reportId, personId, callback)
  }

  /**
    * Create a new Sport Event (Score, foul, etc)
    * @param {String} reportId The report identifier
    * @param {Object} person The Person who is involved in this Event
    * @param {Object} team The Team which is involved in this Event
    * @param {String} eventType The string that represents an EventType
    * @param {Number} matchTime Match time when the event happened in miliseconds
    * @param {String} cause The cause of this Event or extra information
    * @param {Number} timestamp Real time when the event happened in miliseconds
    * @param {eventCallback} callback A callback that returns the created element or error
    */
  create (userId, reportId, person, team, eventType, matchTime, cause, timestamp, callback) {
    // Check if report exists
    this.ReportService.findById(userId, reportId, (anyReport, err) => {
      if (err !== null) {
        return callback(null, new InstanceNotFoundException('Non existent report', 'event.reportId', reportId))
      }
      // Check if person exists
      this.PersonService.findByPersonIdReportIdAndTeamId(person._id, reportId, team._id, (anyPerson, err) => {
        if (err !== null) {
          return callback(null, new InstanceNotFoundException('Non existent person', 'person._id', person._id))
        }
        // Check if team exists
        this.TeamService.findById(team._id, (anyTeam, err) => {
          if (err !== null) {
            return callback(null, new InstanceNotFoundException('Non existent team', 'team._id', team._id))
          }
          // Save it
          EventDao.create(reportId, person, team, eventType, matchTime, cause, timestamp, callback)
        })
      })
    })
  }

  /**
    * Create a new Control Event (Start game, change term, etc)
    * @param {String} reportId The report identifier
    * @param {String} eventType The string that represents an EventType
    * @param {Number} matchTime Match time when the event happened in miliseconds
    * @param {String} text The cause of this Event or extra information
    * @param {Number} timestamp Real time when the event happened in miliseconds
    * @param {eventCallback} callback A callback that returns the created element or error
    */
  createControl (userId, reportId, eventType, matchTime, text, timestamp, callback) {
    // Get report and status
    this.ReportService.findById(userId, reportId, (report, err) => {
      if (err !== null) {
        return callback(report, err)
      }
      // Create oldStatus
      let oldStatus = ReportStatusManager.getStatusFromType(report.status)
      let newStatus = oldStatus.addEvent(eventType) // Get the new event

      // Check if status must be changed
      if (newStatus !== null) {
        // Check if there is an error
        if (newStatus.name === new ReportStatusException().name) {
          return callback(eventType, newStatus)
        }

        this.ReportService.update(userId, report._id, report.date, report.location, newStatus,
          report.localTeam, report.visitorTeam, report.incidences, function (report, err) {
            if (err !== null) {
              return callback(null, err)
            }
            EventDao.createControl(reportId, eventType, matchTime, text, timestamp, callback)
          })
      } else {
        EventDao.createControl(reportId, eventType, matchTime, text, timestamp, callback)
      }
    })
  }

  /**
    * Delete an Event (Control or Sport)
    * @param {String} eventId The Event identifier
    * @param {eventCallback} callback A callback that returns an object with
    * the deleted eventId if the event was deleted
    */
  deleteEvent (userId, eventId, callback) {
    // Get the event
    this.findById(eventId, (event, err) => {
      if (err === null) {
        // Get report and status
        this.ReportService.findById(userId, event.reportId, (report, err) => {
          if (err !== null) {
            return callback(report, err)
          }
          // Create oldStatus
          let oldStatus = ReportStatusManager.getStatusFromType(report.status)
          let newStatus = oldStatus.removeEvent(event.type) // Get the new event

          // Check if status must be changed
          if (newStatus !== null) {
            // Check if there is an error
            if (newStatus.name === new ReportStatusException().name) {
              return callback(event.type, newStatus)
            }
            this.ReportService.update(userId, report._id, report.date, report.location, newStatus,
              report.localTeam, report.visitorTeam, report.incidences, function (report, err) {
                if (err !== null) {
                  return callback(null, err)
                }
                EventDao.deleteEvent(event, callback)
              })
          } else {
            EventDao.deleteEvent(event, callback)
          }
        })
      } else {
        callback(null, new InstanceNotFoundException('Non existent event', 'eventId', eventId))
      }
    })
  }

  /**
    * Delete all Events from a Report
    * @param {String} reportId The Report identifier
    * @param {eventCallback} callback A callback that returns if Events were removed
    */
  deleteAllEventsByReportId (reportId, callback) {
    this.findAllByReportId(reportId, (eventList, err) => {
      if (err !== null) {
        return callback(eventList, err)
      }
      eventList.map((event) => {
        EventDao.deleteEvent(event, function (res, err) {
          // TODO Check this errors
          if (err !== null) {
            return callback(null, err)
          }
        })
      })
      callback(eventList, err)
    })
  }

}

module.exports = EventService
