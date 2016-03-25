import GenericDao from './GenericDao'
import {Event, ControlEvent} from '../models/event/Event'

let EventDao = {

  databaseType: 'event',

  findById: function (eventId, callback) {
    GenericDao.findById(eventId, callback)
  },

  findAllByReportId: function (reportId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'timestamp', 'reportId']}
    }).then(function () {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
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

  findAllByReportIdAndEventType: function (reportId, eventType, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {
        fields: ['databaseType', 'timestamp', 'reportId', 'type']
      }
    }).then(function () {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
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

  create: function (reportId, person, team, eventType, matchTime, cause, timestamp, callback) {
    let event = new Event(null, reportId, person, team, eventType, matchTime, cause, timestamp)
    // Save it
    GenericDao.create(event, callback)
  },

  createControl: function (reportId, eventType, matchTime, text, timestamp, callback) {
    // Create the new event
    let event = new ControlEvent(null, reportId, eventType, matchTime, text, timestamp)
    // Save the event
    GenericDao.create(event, callback)
  },

  deleteEvent: function (event, callback) {
    // Remove the event
    GenericDao.remove(event, callback)
  }

}

module.exports = EventDao