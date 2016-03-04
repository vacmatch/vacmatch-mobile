import GenericService from './GenericService'
import {Event, ControlEvent} from '../models/event/Event'
import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'
import ReportService from './ReportService'
import PersonService from './PersonService'
import TeamService from './TeamService'
import EndMatchEvent from '../models/web/event/control/EndMatchEvent'

let EventService = {

  /**
   * Returns the type of this service
   * @returns {String} The type identifier
   */
  getType: function () {
    return 'event'
  },

  /**
   * Callback to return lists in Event Service
   * @callback eventListCallback
   * @param {Object[]} list - A Event list.
   * @param {Object} err - An error object.
   */

  /**
   * Callback to return an element in Event Service
   * @callback eventCallback
   * @param {Object} element - A Event object.
   * @param {Object} err - An error object.
   */

  /**
    * Get an Event by Id
    * @param {Number} id The event identifier
    * @param {eventCallback} callback A callback that returns an event
    */
  findById: function (eventId, callback) {
    GenericService.findById(eventId, callback)
  },

  /**
    * Get all Events from a Report
    * @param {Number} reportId The report identifier
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportId: function (reportId, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {fields: ['timestamp', 'reportId']}
    }).then(function () {
      return db.find({
        selector: {
          timestamp: {$exists: true},
          reportId: {$eq: reportId}
        },
        sort: [
          {'timestamp': 'desc'},
          {'reportId': 'asc'}
        ]
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Get all Events from this EventType in a Report
    * @param {Number} reportId The report identifier
    * @param {String} eventType The string that represents an EventType
    * @param {eventListCallback} callback A callback that returns an Event list
    */
  findAllByReportIdAndEventType: function (reportId, eventType, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {
        fields: ['timestamp', 'reportId', 'type']
      }
    }).then(function () {
      return db.find({
        selector: {
          timestamp: {$exists: true},
          reportId: {$eq: reportId},
          type: {$eq: eventType}
        },
        sort: [
          {'timestamp': 'desc'},
          {'reportId': 'asc'},
          {'type': 'asc'}
        ]
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Create a new Sport Event (Score, foul, etc)
    * @param {Number} reportId The report identifier
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
          let event = new Event(this.getType(), reportId, person, team, eventType, matchTime, cause, timestamp)
          // Save it
          GenericService.create(event, callback)
        })
      })
    })
  },

  /**
    * Create a new Control Event (Start game, change term, etc)
    * @param {Number} reportId The report identifier
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

      // Create the new event
      let event = new ControlEvent(this.getType(), reportId, eventType, matchTime, text, timestamp)

      // Check if it's an end match event
      let endEvent = new EndMatchEvent()
      if (eventType === endEvent.type) {
        let hasFinished = true
        // Update report result with new value
        ReportService.update(reportId, report.date, hasFinished, report.location,
          report.localTeam, report.visitorTeam, report.incidences, function (report, err) {
            if (err !== null) {
              return callback(null, err)
            }
            // Save the event
            GenericService.create(event, callback)
          })
      } else {
        // Save the event
        GenericService.create(event, callback)
      }
    })
  },

  /**
    * Delete an Event (Control or Sport)
    * @param {Number} eventId The Event identifier
    * @param {eventCallback} callback A callback that returns an object with
    * the deleted eventId if the event was deleted
    */
  deleteEvent: function (eventId, callback) {
    this.findById(eventId, function (event, err) {
      if (err === null) {
        // Remove it
        GenericService.remove(event, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent event', 'eventId', eventId))
      }
    })
  }
}

module.exports = EventService
