import EventDao from '../daos/EventDao'
import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'
import ReportService from './ReportService'
import PersonService from './PersonService'
import TeamService from './TeamService'
import EndMatchEvent from '../models/web/event/control/EndMatchEvent'

let EventService = {

  /**
    * Get an Event by Id
    * @param {String} id The event identifier
    * @param {eventCallback} callback A callback that returns an event
    */
  findById: function (eventId, callback) {
    EventDao.findById(eventId, callback)
  },

  /**
    * Get all Events from a Report
    * @param {String} reportId The report identifier
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportId: function (reportId, callback) {
    EventDao.findAllByReportId(reportId, callback)
  },

  /**
    * Get all Events from this EventType in a Report
    * @param {String} reportId The report identifier
    * @param {String} eventType The string that represents an EventType
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportIdAndEventType: function (reportId, eventType, callback) {
    EventDao.findAllByReportIdAndEventType(reportId, eventType, callback)
  },

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
  create: function (reportId, person, team, eventType, matchTime, cause, timestamp, callback) {
    // Check if report exists
    ReportService.findById(reportId, (anyReport, err) => {
      if (err !== null) {
        return callback(null, new InstanceNotFoundException('Non existent report', 'event.reportId', reportId))
      }
      // Check if person exists
      PersonService.findByPersonIdReportIdAndTeamId(person._id, reportId, team._id, (anyPerson, err) => {
        if (err !== null) {
          return callback(null, new InstanceNotFoundException('Non existent person', 'person._id', person._id))
        }
        // Check if team exists
        TeamService.findById(team._id, (anyTeam, err) => {
          if (err !== null) {
            return callback(null, new InstanceNotFoundException('Non existent team', 'team._id', team._id))
          }
          // Save it
          EventDao.create(reportId, person, team, eventType, matchTime, cause, timestamp, callback)
        })
      })
    })
  },

  /**
    * Create a new Control Event (Start game, change term, etc)
    * @param {String} reportId The report identifier
    * @param {String} eventType The string that represents an EventType
    * @param {Number} matchTime Match time when the event happened in miliseconds
    * @param {String} text The cause of this Event or extra information
    * @param {Number} timestamp Real time when the event happened in miliseconds
    * @param {eventCallback} callback A callback that returns the created element or error
    */
  createControl: function (reportId, eventType, matchTime, text, timestamp, callback) {
    // Check if report exists
    ReportService.findById(reportId, (report, err) => {
      if (err !== null) {
        return callback(null, new InstanceNotFoundException('Non existent report', 'event.reportId', reportId))
      }
      // Check if it's an end match event
      let endEvent = new EndMatchEvent()
      if (eventType === endEvent.type) {
        let hasFinished = true
        // Update report state with new value
        ReportService.update(reportId, report.date, hasFinished, report.location,
          report.localTeam, report.visitorTeam, report.incidences, function (report, err) {
            if (err !== null) {
              return callback(null, err)
            }
            // Save the event
            EventDao.create(reportId, eventType, matchTime, text, timestamp, callback)
          })
      } else {
        // Save the event
        EventDao.create(reportId, eventType, matchTime, text, timestamp, callback)
      }
    })
  },

  /**
    * Delete an Event (Control or Sport)
    * @param {String} eventId The Event identifier
    * @param {eventCallback} callback A callback that returns an object with
    * the deleted eventId if the event was deleted
    */
  deleteEvent: function (eventId, callback) {
    // Get the event
    this.findById(eventId, function (event, err) {
      if (err === null) {
        // Check if it's an end match event
        let endEvent = new EndMatchEvent()
        if (event.type === endEvent.type) {
          let hasFinished = false
          // Find report
          ReportService.findById(event.reportId, function (report, err) {
            if (err !== null) {
              return callback(null, new InstanceNotFoundException('Non existent report', 'event.reportId', event.reportId))
            }
            // Update report state with new value
            ReportService.update(event.reportId, report.date, hasFinished, report.location,
              report.localTeam, report.visitorTeam, report.incidences, function (report, err) {
                if (err !== null) {
                  return callback(null, err)
                }
                // Remove the event
                EventDao.deleteEvent(event, callback)
              })
          })
        } else {
          // Remove the event
          EventDao.deleteEvent(event, callback)
        }
      } else {
        callback(null, new InstanceNotFoundException('Non existent event', 'eventId', eventId))
      }
    })
  },

  /**
    * Delete all Events from a Report
    * @param {String} reportId The Report identifier
    * @param {eventCallback} callback A callback that returns if Events were removed
    */
  deleteAllEventsByReportId: function (reportId, callback) {
    this.findAllByReportId(reportId, (eventList, err) => {
      eventList.map((event) => {
        EventDao.deleteEvent(event, function (res, err) {
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
